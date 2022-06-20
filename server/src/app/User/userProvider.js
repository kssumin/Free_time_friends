//const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston.js");
const userDao = require("./userDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveUserList = async function (email) {
  if (!email) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userListResult = await userDao.selectUser(connection);
    connection.release();

    return userListResult;

  } else {
    const connection = await pool.getConnection(async (conn) => conn);
    const userListResult = await userDao.selectUserEmail(connection, email);
    connection.release();

    return userListResult;
  }
};

exports.retrieveUser = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userResult = await userDao.selectUserId(connection, userId);

  connection.release();

  return userResult;
};

// 유저 이메일
exports.emailCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const emailCheckResult = await userDao.selectUserEmail(connection, email);
  connection.release();

  return emailCheckResult;
};

// 유저 아이디
exports.userIdCheck = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userIdCheckResult = await userDao.selectUserId(connection, userId);
  connection.release();

  return userIdCheckResult;
};
// 학교 확인
exports.collegeCheck = async function (college) {
  const connection = await pool.getConnection(async (conn) => conn);
  const collegeCheckResult = await userDao.selectCollege(connection, college);
  connection.release();

  return collegeCheckResult;
};

// 친구 확인
exports.retrieveFriends = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const friendsResult = await userDao.selectFriends(connection, userId);

  connection.release();

  return friendsResult;
};


exports.passwordCheck = async function (selectUserPasswordParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const passwordCheckResult = await userDao.selectUserPassword(
      connection, selectUserPasswordParams
  );
  connection.release();
  return passwordCheckResult[0];
};

exports.accountCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userAccountResult = await userDao.selectUserAccount(connection, email);
  connection.release();

  return userAccountResult;
};