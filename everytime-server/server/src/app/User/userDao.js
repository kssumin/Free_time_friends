// 모든 유저 조회
async function selectUser(connection) {
  const selectUserListQuery = `
          SELECT id, userId, password, name, email, nickname, 
                 studentId, college , myMajor, studentId
          FROM UserTB;
              `;
  const [userRows] = await connection.query(selectUserListQuery);
  return userRows;
}

// 이메일로 회원 조회
async function selectUserEmail(connection, email) {
  const selectUserEmailQuery = `
        SELECT id, userId, email, name, nickname
        FROM UserTB
        WHERE email = ?;
                `;
  const [emailRows] = await connection.query(selectUserEmailQuery, email);
  return emailRows;
}

// userId 회원 조회
async function selectUserId(connection, userId) {
  const selectUserIdQuery = `
          SELECT userId, name, nickname,
                 CONCAT(SUBSTRING(college, 1,3), ' ', SUBSTRING(studentId,1,2),'학번') AS userInfo
          FROM UserTB
          WHERE userId = ?;
                 `;
  const [userIdRows] = await connection.query(selectUserIdQuery, userId);
  return userIdRows;
}
// 에브리타임 제공되는 학교 확인
async function selectCollege(connection, college) {
  const selectColNameQuery = `
        SELECT * FROM College WHERE collegeName = ?;
    `;
  const [collegeRows] = await connection.query(selectColNameQuery, college);
  return collegeRows;
}

// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
        INSERT INTO UserTB(userId, password, name, email, nickname, studentId, profileImage, 
                          status, myMajor, createdAt, updatedAt ,college)
        VALUES (?, ?, ?, ?, ?, ?, NULL, 0, ?, now(), now(), ?);

    `;
  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    insertUserInfoParams
  );

  return insertUserInfoRow;
}
// 4. 친구 조회
async function selectFriends(connection, userId){
              const selectFriendsIdQuery = `
              SELECT name
              FROM FriendList FL
              INNER JOIN UserTB UT ON FL.friendId = UT.id
              WHERE FL.userId = ?;
                 `;
  const [FriendRows] = await connection.query(selectFriendsIdQuery, userId);
  return FriendRows;
}

// 패스워드 체크
async function selectUserPassword(connection, selectUserPasswordParams) {
  const selectUserPasswordQuery = `
        SELECT email, nickname, password
        FROM UserTB
        WHERE email LIKE ? AND password LIKE ?;
        `;
  const selectUserPasswordRow = await connection.query( selectUserPasswordQuery, selectUserPasswordParams );

  return selectUserPasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectUserAccount(connection, email) {
  const selectUserAccountQuery = `
        SELECT status, id
        FROM UserTB
        WHERE email = ?;
        `;
  const selectUserAccountRow = await connection.query( selectUserAccountQuery, email );
  return selectUserAccountRow[0];
}

async function updateUserInfo(connection, id, nickname) {
  const updateUserQuery = `
      UPDATE UserTB
      SET nickname = ?
      WHERE id = ?;
  `;
  const updateUserRow = await connection.query(updateUserQuery, [nickname, id]);
  return updateUserRow[0];
}

async function updateProfileInfo(connection, id, profileImage) {
  const updateProfileQuery = `
      UPDATE UserTB
      SET profileImage = ?
      WHERE UserTB.id = ?;
  `;
  const updateProfileRow = await connection.query(updateProfileQuery, [profileImage, id]);
  return updateProfileRow[0];
}

module.exports = {
  selectUser,
  selectUserEmail,
  selectUserId,
  selectCollege,
  insertUserInfo,
  selectFriends,
  selectUserPassword,
  selectUserAccount,
  updateUserInfo,
  updateProfileInfo
};
