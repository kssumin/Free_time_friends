module.exports = {

    // Success
    SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" },

    // Common
    TOKEN_EMPTY : { "isSuccess": false, "code": 2000, "message":"JWT 토큰을 입력해주세요." },
    TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 3000, "message":"JWT 토큰 검증 실패" },
    TOKEN_VERIFICATION_SUCCESS : { "isSuccess": true, "code": 1001, "message":"JWT 토큰 검증 성공" },
    USER_ID_NOT_MATCH : { "isSuccess": false, "code": 3018, "message": "JWT 토큰과 userID 일치 실패" },

    //Request error
    SIGNUP_USERID_EMPTY : { "isSuccess": false, "code": 2001, "message":"아이디를 입력해주세요" },
    SIGNUP_USERID_LENGTH : { "isSuccess": false, "code": 2002, "message":"아이디는 4~20자리 미만으로 입력해주세요." },
    SIGNUP_USERID_ERROR_TYPE : { "isSuccess": false, "code": 2003, "message":"아이디를 특수문자를 제외하고 입력해주세요." },
    SIGNUP_EMAIL_EMPTY : { "isSuccess": false, "code": 2004, "message":"이메일을 입력해주세요" },
    SIGNUP_EMAIL_LENGTH : { "isSuccess": false, "code": 2005, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNUP_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2006, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNUP_PASSWORD_EMPTY : { "isSuccess": false, "code": 2007, "message": "비밀번호를 입력 해주세요." },
    SIGNUP_PASSWORD_LENGTH : { "isSuccess": false, "code": 2008, "message":"비밀번호는 6~20자리를 입력해주세요." },
    SIGNUP_NICKNAME_EMPTY : { "isSuccess": false, "code": 2009, "message":"닉네임을 입력 해주세요." },
    SIGNUP_NICKNAME_LENGTH : { "isSuccess": false,"code": 2010,"message":"닉네임은 최대 20자리를 입력해주세요." },
    SIGNUP_COLLEGE_EMPTY : { "isSuccess": false,"code": 2011,"message":"해당 앱에 존재하지 않은 학교입니다." },

    SIGNIN_EMAIL_EMPTY : { "isSuccess": false, "code": 2013, "message":"이메일을 입력해주세요" },
    SIGNIN_EMAIL_LENGTH : { "isSuccess": false, "code": 2014, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNIN_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2015, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNIN_PASSWORD_EMPTY : { "isSuccess": false, "code": 2016, "message": "비밀번호를 입력 해주세요." },

    USER_USERID_EMPTY : { "isSuccess": false, "code": 2017, "message": "userId를 입력해주세요." },
    USER_USERID_NOT_EXIST : { "isSuccess": false, "code": 2018, "message": "해당 회원이 존재하지 않습니다." },

    USER_USEREMAIL_EMPTY : { "isSuccess": false, "code": 2019, "message": "이메일을 입력해주세요." },
    USER_USEREMAIL_NOT_EXIST : { "isSuccess": false, "code": 2020, "message": "해당 이메일을 가진 회원이 존재하지 않습니다." },
    USER_ID_NOT_MATCH : { "isSuccess": false, "code": 2021, "message": "유저 아이디 값을 확인해주세요" },
    USER_NICKNAME_EMPTY : { "isSuccess": false, "code": 2022, "message": "변경할 닉네임 값을 입력해주세요" },

    USER_STATUS_EMPTY : { "isSuccess": false, "code": 2020, "message": "회원 상태값을 입력해주세요" },
    USER_FRINEDS_NOT_EXIST : { "isSuccess": false, "code": 2023, "message": "친구가 저장되어있지 않습니다." },

    INPUT_WRONG : { "isSuccess": false, "code": 2024, "message": "입력 형식이 잘못 되었습니다." },
    INPUT_LENGTH : { "isSuccess": false, "code": 2025, "message":"30자리 미만으로 입력해주세요." },
    INPUT_TITLE_EMPTY : { "isSuccess": false, "code": 2026, "message": "제목이 비어있습니다." },
    INPUT_EMPTY : { "isSuccess": false, "code": 2027, "message": "입력 값이 비어있습니다." },
    INPUT_BOARDID_EMPTY : { "isSuccess": false, "code": 2028, "message": "게시판 인덱스를 입력해주세요." },
    INPUT_TITLE_LENGTH : { "isSuccess": false, "code": 2029, "message": "두 글자 이상으로 입력하세요." },
    INPUT_TITLE_LENGTH2 : { "isSuccess": false, "code": 2030, "message": "입력 범위를 초과했습니다." },
    INPUT_SEMESTER_INDEX : { "isSuccess": false, "code": 2031, "message": "학기 인덱스는 1부터 시작합니다." },
    INPUT_NUMBER : { "isSuccess": false, "code": 2032, "message": "숫자만 입력해주세요." },
    INPUT_NOT_SPACE : { "isSuccess": false, "code": 2033, "message": "공백없이 입력해주세요." },

    INPUT_SUBJECT_EMPTY : { "isSuccess": false, "code": 2034, "message": "과목명이 비어있습니다." },
    INPUT_TRUE_FALSE : { "isSuccess": false, "code": 2035, "message": "True와 False로 입력해주세요." },
    INPUT_SEMESTER_INDEX2 : { "isSuccess": false, "code": 2036, "message": "추가 시간표 인덱스는 1부터 시작합니다." },
    INPUT_SEMESTER_WRONG : { "isSuccess": false, "code": 2037, "message": "학기 입력이 잘못되었습니다." },
    INPUT_INDEX : { "isSuccess": false, "code": 2039, "message": "인덱스는 1부터 시작합니다." },

    INPUT_PROFILE_EMPTY : { "isSuccess": false, "code": 2040, "message": "프로필 이미지가 비어습니다." },
    INPUT_PROFILE_WRONG : { "isSuccess": false, "code": 2041, "message": "jpg png bmp 형식이 아닙니다." },




    // Response error
    SIGNUP_REDUNDANT_EMAIL : { "isSuccess": false, "code": 3001, "message":"중복된 이메일입니다." },
    SIGNUP_REDUNDANT_NICKNAME : { "isSuccess": false, "code": 3002, "message":"중복된 닉네임입니다." },
    SIGNUP_REDUNDANT_USERID : { "isSuccess": false, "code": 3002, "message":"중복된 아이디입니다." },
    CREATE_REDUNDANT_BOARD : { "isSuccess": false, "code": 3003, "message":"중복된 게시판입니다." },

    SIGNIN_USERID_WRONG : { "isSuccess": false, "code": 3004, "message": "아이디가 잘못 되었습니다." },
    SIGNIN_PASSWORD_WRONG : { "isSuccess": false, "code": 3005, "message": "비밀번호가 잘못 되었습니다." },
    SIGNIN_INACTIVE_ACCOUNT : { "isSuccess": false, "code": 3006, "message": "비활성화 된 계정입니다. 고객센터에 문의해주세요." },
    SIGNIN_WITHDRAWAL_ACCOUNT : { "isSuccess": false, "code": 3007, "message": "탈퇴 된 계정입니다. 고객센터에 문의해주세요." },

    SELECT_BOARD_EMPTY : { "isSuccess": false, "code": 3008, "message": "게시판을 추가해주세요." },
    SEARCH_BOARD_EMPTY : { "isSuccess": false, "code": 3009, "message": "해당하는 게시판이 없습니다." },
    SELECT_POST_EMPTY : { "isSuccess": false, "code": 3010, "message": "게시글이 존재하지 않습니다." },
    SET_STATUS_ACTIVE : { "isSuccess": false, "code": 3010, "message": "삭제할 수 없습니다." },
    SEARCH_NO_SUBJECT: { "isSuccess": false, "code": 3011, "message": "검색 결과가 없습니다." },
    SEARCH_YES_SUBJECT: { "isSuccess": false, "code": 3012, "message": "이미 추가된 과목입니다." },
    SEARCH_NO_MySubject: { "isSuccess": false, "code": 3013, "message": "삭제할 과목이 없습니다." },

    SEARCH_NOT_EXIST : { "isSuccess": false, "code": 3014, "message": "해당 포스트 | 댓글 | 리뷰에 좋아요를 누를 수 없습니다." },



    SELECT_BOOK_EMPTY : { "isSuccess": false, "code": 3014, "message": "게시글을 추가해주세요" },
    SEARCH_BOOK_EMPTY : { "isSuccess": false, "code": 3015, "message": "검색된 책이 없습니다" },
    INPUT_SEARCH_LENGTH : { "isSuccess": false, "code": 2038, "message": "검색어를 두 글자 이상 입력하세요!" },

    SELECT_REVIEW_EMPTY : { "isSuccess": false, "code": 3016, "message":  "아직 등록된 강의평이 없습니다." },
    SEARCH_REVIEW_EMPTY : { "isSuccess": false, "code": 3017, "message": "검색된 과목 및 교수가 없습니다." },


    //Connection, Transaction 등의 서버 오류
    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},

}
