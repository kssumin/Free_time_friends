const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");



/**
 * API No. 1
 * API Name : 유저 생성 (회원가입) API
 * [POST] /app/users
 */
exports.postUsers = async function (req, res) {

    /**
     * Body: collegeName, userId, password, email, nickname
     */
    const { userId, password, name, email, nickname, studentId, myMajor, college } = req.body;

    // 빈 값 체크
    if (!userId)
        return res.send(response(baseResponse.SIGNUP_USERID_EMPTY));
    if (!password)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY));
    if (!email)
        return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));
    if (!nickname)
        return res.send(response(baseResponse.SIGNUP_NICKNAME_EMPTY));

    // 길이 체크
    if (userId.length < 4 || userId.length > 20)
        return res.send(response(baseResponse.SIGNUP_USERID_LENGTH));
    if (password.length < 6 || password > 20)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH));
    if (email.length > 30)
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));
    if (nickname > 20)
        return res.send(response(baseResponse.SIGNUP_NICKNAME_LENGTH));

    // 형식 체크 (by 정규표현식)
    var idReg = /^[A-za-z0-9]{4,20}/g;
    if (!idReg.test(userId))
        return res.send(response(baseResponse.SIGNUP_USERID_ERROR_TYPE));
    if (!regexEmail.test(email))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));


    const signUpResponse = await userService.createUser(
        userId, password, name, email, nickname, studentId, myMajor, college
    );

    return res.send(signUpResponse);
};

/**
 * API No. 2
 * API Name : 특정 유저 조회 API + 마이페이지
 * [GET] /app/users/:userId
 */
exports.getUserById = async function (req, res) {

    /**
     * Path Variable: userId
     */

    if (!userId)
        return res.send(response(baseResponse.SIGNUP_USERID_EMPTY));
    // 공백 체크
    var re = /s$/;
    if(re.test(userId))
        return res.send(response(baseResponse.INPUT_NOT_SPACE));

    if (userId.length < 4 || userId.length > 20)
        return res.send(response(baseResponse.SIGNUP_USERID_LENGTH));

    var idReg = /^[A-za-z0-9]{4,20}/g;
    if (!idReg.test(userId))
        return res.send(response(baseResponse.SIGNUP_USERID_ERROR_TYPE));


    const userId = req.params.userId;

    const userByUserId = await userProvider.retrieveUser(userId);
    if(userByUserId.length < 1)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST));

    return res.send(response({ "isSuccess": true, "code": 1000, "message":"마이 페이지 조회 성공" }, userByUserId));
};

/**
 * API No. 4
 * API Name : 친구 조회 API
 * [GET] /user/:userId/friends
 */

exports.getFriendsById = async function (req, res){
    /**
     * Path Variable: userId
     * */

    const userId = req.params.userId;

    const friendsByUserId = await userProvider.retrieveFriends(userId);
    if(friendsByUserId.length < 1)
         return res.send(errResponse(baseResponse.USER_FRINEDS_NOT_EXIST ));
    return res.send(response(baseResponse.SEARCH_FRIENDS_BY_USERID_SUCCESS, friendsByUserId));
    
};

// TODO: After 로그인 인증 방법 (JWT)
/**
 * API No. 7
 * API Name : 로그인 API
 * [POST] /app/login
 * body : email, passsword
 */
exports.login = async function (req, res) {

    const {email, password} = req.body;

    // 빈 값 체크
    if (!email)
        return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));

    if (!password)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY));


    // 공백 체크
    var re = /s$/;
    if(re.test(email) || re.test(password))
        return res.send(response(baseResponse.INPUT_NOT_SPACE));

    // 길이 체크
    if (email.length > 30)
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));
    if (password.length < 6 || password > 20)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH));
    
    // 형식 체크 (by 정규표현식)
    if (!regexEmail.test(email))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));


    const signInResponse = await userService.postSignIn(email, password);
    console.log(signInResponse);


    // postman
    return res.send(signInResponse);
};


/**
 * API No. 5
 * API Name : 프로필 이미지 변경
 * [PATCH] /app/user/:userId/profileImage
 * body : profileImage (text)
 */
exports.patchProfileImage = async function (req, res) {

    // jwt - userId, path variable :userId

    const userIdFromJWT = req.verifiedToken.userId;

    const userId = req.params.userId;
    const profileImage = req.body.profileImage;
    

    // 빈 값 체크
    if (!userId) return res.send(response(baseResponse.USER_USERID_EMPTY));

    // 공백 체크
    var re = /s$/;
    if(re.test(userId) || re.test(profileImage))
        return res.send(response(baseResponse.INPUT_NOT_SPACE));

    // 숫자 체크
    var regExp = /^[0-9]+$/;
    if(!regExp.test(userId))
        return res.send(response(baseResponse.INPUT_NUMBER));


    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {

        if(!profileImage)
            return res.send(errResponse(baseResponse.INPUT_PROFILE_EMPTY));

        var imgRegex = /\.(png|jpg|bmp)$/i;
        if(!imgRegex.test(profileImage))
            return res.send(errResponse(baseResponse.INPUT_PROFILE_WRONG));

        const editProfileInfo = await userService.updateProfileImage(userId, profileImage)


        return res.send(editProfileInfo);
    }
};

/**
 * API No. 4
 * API Name : 사용자 닉네임 수정 + JWT + Validation
 * [PATCH] /app/users/:userId
 * path variable : userId
 * body : nickname
 */
exports.patchUsers = async function (req, res) {

    // jwt - userId, path variable :userId

    const userIdFromJWT = req.verifiedToken.userId

    const userId = req.params.userId;
    const nickname = req.body.nickname;

    // userId, nickname validation 처리
    // 빈 값 체크
    if (!userId) return res.send(response(baseResponse.USER_USERID_EMPTY));

    // 공백 체크
    var re = /s$/;
    if(re.test(userId) || re.test(nickname))
        return res.send(response(baseResponse.INPUT_NOT_SPACE));

    // 숫자 체크
    var regExp = /^[0-9]+$/;
    if(!regExp.test(userId))
        return res.send(response(baseResponse.INPUT_NUMBER));

    // 닉네임 길이
    if (nickname.length > 20)
        return res.send(response(baseResponse.SIGNUP_NICKNAME_LENGTH));

    if(nickname.length < 2)
        return res.send(response(baseResponse.INPUT_TITLE_LENGTH));

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if(!nickname) return res.send(response(baseResponse.INPUT_PROFILE_EMPTY));

        const editUserInfo = await userService.editUser(userId, nickname)
        return res.send(editUserInfo);
    }
};

/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
// exports.check = async function (req, res) {
//     const userIdResult = req.verifiedToken.userId;
//     console.log(userIdResult);
//     return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
// };
