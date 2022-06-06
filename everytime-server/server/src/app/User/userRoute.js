module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    
    const jwt = require("jsonwebtoken");
    const crypto = require("crypto");
    const {connect} = require("http2");

    /*
    import { Router } from "express";    
    import qs from "querystring";
    import {OAuth2} from "oauth";
    import path from "path";
    import ParseRest from "./ParseRest";
    */

    const {Router} = require('express');
    const qs = require('querystring');
    const {OAuth2} = require('oauth');
    const path = require('path');
    //const ParseRest = require('./ParseRest');

    // keep user info to session = default
    function defaultUserHandler(req, _user) {
        // error
        if (!_user) return {};

        // login results
        if (typeof req.session === "object") {
            if (_user.sessionToken) req.session.sessionToken = _user.sessionToken;

            req.session.user = ""
            req.session.user.sessionToken = req.session.sessionToken;

            return req.session.user;
        }
        return _user;
    }

    function naverOAuth2() {
        const appId = keyConverter(process.env.NAVER_APPIDS);
        const secret = keyConverter(process.env.NAVER_SECRETS);
        return new OAuth2(
            appId,
            secret,
            "",
            "https://nid.naver.com/oauth2.0/authorize",
            "https://nid.naver.com/oauth2.0/token",
            null
        );
    }



    // 1. 유저 생성 (회원가입) API
    //app.route('/app/users/register').post(user.postUsers);


    // 2. 특정 유저 조회 API
    app.get('/app/users/:userId', user.getUserById);

    // 3. 사용자 활성화 비활성화
    //app.patch('/app/user', user.patchStatus);

    // 4. 회원 정보 수정 API (JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
    //app.patch('/app/users/:userId/nickName', jwtMiddleware, user.patchUsers)

    // 5. 사용자 프로필 이미지 수정
    //app.patch('/app/users/:userId/profileImage', jwtMiddleware ,user.patchProfileImage);

    // 6. 친구 유저 조회 API
    //app.get('/app/user/friends', user.getFriendsById);


    var users = [
        {
            email:'',
            password: '',
            nickname:""
        }
    ];

    app.get('/app/user/logout', function(req, res){
        delete req.session.nickname;
        req.session.save(function(){
            res.redirect('/app/user/welcome');
        }) ;
    });


    //7. 로그인 하기 API (JWT 생성)// TODO: After 로그인 인증 방법 (JWT)
    //
    //app.post('/app/user/login', user.login);

    app.post('/app/user/login', function(req, res){
        const email = req.body.email;
        const password = req.body.password;

        var me = {
            email:'',
            password: '',
            nickname: ''
        };

        // homepage
        if(email === me.email && password === me.password){
            req.session.nickname = me.nickname;
            req.session.save(function(){
                res.redirect('/app/user/welcome');
            });
            //res.send(req.session);
        } else {
            res.send('Login FAIL <a href="/app/user/login">login</a>');
        }

    });


    app.get('/app/user/login', function(req,res){
        var output = `
        
            <h1>LOGIN</h1>
            <form  action="/app/user/login" method="post" >
                <p><input type="email" name="email" placeholder="email"/></p>
                <p><input type="password" name="password" placeholder="password"/></p>
                <p><input type="submit" /></p>
            </form>
        `;
        res.send(output);
    });
    //app.post('/app/logout', user.logout);


    // jwt를 사용하기 위해 jwtMiddleware 를 체이닝 방식으로 추가하는 예제
    //app.get('/app/users/:userId', jwtMiddleware, user.getUserById);

};

module.exports.SocialOAuth2 = class{
    /**
     * @param {Object?} api - Express router
     * @return {Object} express router
     */
    static create(options, api = Router()) {
        const router = new SocialOAuth2(options);
        // naver
        api.get("/naver/auth", (req, res) => router.naverAuth(req, res));
        api.get("/naver/callback", (req, res) => router.naverCallback(req, res));
        api.post("/naver/login", (req, res) => router.naverLogin(req, res));

        return api;
    }

    constructor(options) {
        const _path = options.path;
        // naver
        this.naverOAuth2 = naverOAuth2();
        this.naverRedirectUri = path.join(_path, "/naver/callback");

        // userHandler
        const _userHandler = options.userHandler || defaultUserHandler;

        this.userHandler = (_req, user) => {
            return new Promise(resolve => {
                if (typeof _userHandler.then == "function") {
                    _userHandler(_req, user).then(resolve);
                } else {
                    setTimeout(() => resolve(_userHandler(_req, user)), 0);
                }
            });
        };
    }

    //
    // naver
    //
    naverAuth(req, res) {
        // For eg. "http://localhost:3000/naver/callback"
        const params = {
            redirect_uri: makeRedirectUri(req, this.naverRedirectUri),
            response_type: "code"
        };
        console.log("params", params);
        return res.redirect(this.naverOAuth2.getAuthorizeUrl(params));
    }

    naverCallback(req, res) {
        if (req.error_reason) {
            res.send(req.error_reason);
        }
        if (req.query && req.query.code) {
            // For eg. "/naver/callback"
            this.naverOAuth2.getOAuthAccessToken(
                req.query.code,
                {
                    grant_type: "authorization_code",
                    redirect_uri: makeRedirectUri(req, this.naverRedirectUri)
                },
                (err, accessToken, refreshToken, params) => {
                    if (err) {
                        console.error(err);
                        return res.send(err);
                    }

                    const naverAuth = {
                        access_token: accessToken,
                        expiration_date: params.expires_in
                    };
                    // when custom callback
                    return callbackResult(req, res, naverAuth);
                }
            );
        }
    }

    /**
     * @param {String} accessToken
     * @return {Object} parse user
     */
    naverLogin(req, res) {
        const {body = {}, session = {}} = req;
        console.log("body", body);
        console.log("session", session);
        const accessToken = body.access_token || session.access_token;
        const expires = body.expiration_date || session.expiration_date;
        if (!accessToken)
            return res
                .status(500)
                .json({code: 101, error: "Invalid naver access_token"})
                .end();

        function errorFn(err) {
            console.error(err);
            return res
                .status(500)
                .json(err)
                .end();
        }

        // https://developers.naver.com/docs/login/profile/
        this.naverOAuth2.get("https://openapi.naver.com/v1/nid/me", accessToken, (
            err,
            data /* , response */
        ) => {
            if (err) {
                return errorFn(err);
            }

            const profile = JSON.parse(data).response;
            console.log(profile);

            const authDataEtc = {
                naver: {
                    id: profile.id,
                    access_token: accessToken,
                    expiration_date: expires
                }
            };

            if (!profile.email)
                return errorFn({code: 101, error: "Email is unknown"});

            const parseRest = new ParseRest(req);
            parseRest
                .get(
                    "/users",
                    {where: {username: profile.email}},
                    {useMasterKey: true}
                )
                .then(users => {
                    if (users && users[0]) {
                        // Retrieving
                        const user = users[0];
                        // ban user
                        if (user.isBanned)
                            return errorFn({code: 101, error: "User is banned"});
                        // save param
                        const _param = {socialType: "naver", authDataEtc};
                        parseRest
                            .put("/users/" + user.objectId, _param, {useMasterKey: true})
                            .then(() => {
                                // session query
                                parseRest
                                    .get(
                                        "/sessions",
                                        {
                                            where: {
                                                user: {
                                                    __type: "Pointer",
                                                    className: "_User",
                                                    objectId: user.objectId
                                                }
                                            }
                                        },
                                        {useMasterKey: true}
                                    )
                                    .then(sessions => {
                                        if (sessions && sessions[0]) {
                                            const _session = sessions[0];
                                            if (typeof req.session === "object")
                                                req.session.sessionToken = _session.sessionToken;
                                            // end
                                            return this.userHandler(req, {
                                                ...user,
                                                ..._param,
                                                sessionToken: _session.sessionToken
                                            }).then(handledUser => res.json(handledUser));
                                        }
                                        // login
                                        const password =
                                            typeof profile.id === "number"
                                                ? profile.id.toString()
                                                : profile.id;
                                        return parseRest
                                            .put(
                                                "/users/" + user.objectId,
                                                {password},
                                                {useMasterKey: true}
                                            )
                                            .then(() => {
                                                return parseRest
                                                    .get("/login", {
                                                        username: profile.email,
                                                        password
                                                    })
                                                    .then(result => {
                                                        // reload
                                                        parseRest
                                                            .get("/users/me", null, {
                                                                "X-Parse-Session-Token": result.sessionToken
                                                            })
                                                            .then(_user => {
                                                                // end
                                                                return this.userHandler(req, {
                                                                    ..._user,
                                                                    sessionToken: result.sessionToken
                                                                }).then(handledUser => res.json(handledUser));
                                                            }, errorFn);
                                                    }, errorFn);
                                            }, errorFn);
                                    }, errorFn);
                            }, errorFn);
                    } else {
                        // New
                        const user = {
                            username: profile.email,
                            password:
                                typeof profile.id === "number"
                                    ? profile.id.toString()
                                    : profile.id,
                            name: profile.name,
                            email: profile.email,
                            socialType: "naver",
                            socialProfile: profile,
                            profileImage: {url: profile.profile_image},
                            authDataEtc
                        };
                        parseRest
                            .post("/users", user, {useMasterKey: true})
                            .then(result => {
                                // reload
                                parseRest
                                    .get("/users/me", null, {
                                        "X-Parse-Session-Token": result.sessionToken
                                    })
                                    .then(_user => {
                                        // end
                                        return this.userHandler(req, {
                                            ..._user,
                                            sessionToken: result.sessionToken
                                        }).then(handledUser => res.json(handledUser));
                                    }, errorFn);
                            }, errorFn);
                    }
                }, errorFn);
        });
    }
};