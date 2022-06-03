const {logger} = require("../../../config/winston.js");
//const {pool} = require("../../../config/database");
//const secret_config = require("../../../config/secret");
const userProvider = require("./userProvider");
const userDao = require("./userDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");


const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

// 1. SignUp
exports.createUser = async function (userId, password, name, email, nickname, studentId, myMajor, college) {
    try {
        // 이메일 중복 확인
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);

        // id 중복 확인
        const userIdRows = await userProvider.userIdCheck(userId);
        if (userIdRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_USERID);

        // 학교 확인
        const collegeRows = await userProvider.collegeCheck(college);
        if (collegeRows.length === 0)
            return errResponse(baseResponse.SIGNUP_COLLEGE_EMPTY);

        // 비밀번호 암호화
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

        const insertUserInfoParams = [userId, hashedPassword, name, email, nickname, studentId, myMajor, college];

        const connection = await pool.getConnection(async (conn) => conn);

        const userIdResult = await userDao.insertUserInfo(connection, insertUserInfoParams);
        console.log(`추가된 회원 : ${userIdResult[0].insertId}`)
        connection.release();
        return response(baseResponse.SIGN_UP_SUCCESS);


    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


// TODO: After 로그인 인증 방법 (JWT)
exports.postSignIn = async function (email, password) {
    try {
        // 이메일 여부 확인
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length < 1)
            return errResponse(baseResponse.USER_USERID_NOT_EXIST);


        const selectEmail = emailRows[0].email

        // 비밀번호 확인
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");
        console.log(hashedPassword);
        const selectUserPasswordParams = [selectEmail, hashedPassword];
        const passwordRows = await userProvider.passwordCheck(selectUserPasswordParams);
        console.log(selectUserPasswordParams);

        if (passwordRows[0].password !== hashedPassword) {
            return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
        }
        console.log(passwordRows);

        // 계정 상태 확인
        const userInfoRows = await userProvider.accountCheck(email);

        if (userInfoRows[0].status === 3) {
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        } else if (userInfoRows[0].status === 4) {
            return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
        }

        console.log(userInfoRows[0].id) // DB의 userId

        //토큰 생성 Service
        let token = await jwt.sign(
            {
                userId: userInfoRows[0].id,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "365d",
                subject: "userTB",
            } // 유효 기간 365일
        );
        return response({ "isSuccess": true, "code": 1000, "message": "로그인 성공" }, {'userId': userInfoRows[0].id, 'jwt': token});
    } catch (err) {
        logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR); // 아이디 또는 비번이 잘못되었습니다. 추가 
    }
};

exports.editUser = async function (id, nickname) {
    try {
        console.log(id)
        const connection = await pool.getConnection(async (conn) => conn);
        const editUserResult = await userDao.updateUserInfo(connection, id, nickname)
        connection.release();

        return response({ "isSuccess": true, "code": 1000, "message": "닉네임 변경 성공" });

    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.updateProfileImage = async function(id, profileImage){
    try {
        console.log(id)
        const connection = await pool.getConnection(async (conn) => conn);
        const editProfileResult = await userDao.updateProfileInfo(connection, id, profileImage)
        connection.release();

        return response({ "isSuccess": true, "code": 1000, "message": "프로필 이미지 변경 성공" });

    } catch (err) {
        logger.error(`App - profileResult Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};