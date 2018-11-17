module.exports = {
    user: process.env.NODE_ORACLEDB_USER || "ora_d4b1b",
    password: process.env.NODE_ORACLEDB_PASSWORD || "a17335167",
    connectString: process.env.NODE_ORACLEDB_CONNECTIONSTRING || "dbhost.ugrad.cs.ubc.ca:1522/ug",
    externalAuth: process.env.NODE_ORACLEDB_EXTERNALAUTH ? true : false
};