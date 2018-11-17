const oracledb = require('oracledb');
oracledb.autoCommit = true;
oracledb.queueTimeout = 3000; // 3 seconds

const dbConfig = require('../dbconfig.js');
const connectionInfo = {
    user: dbConfig.user,
    password: dbConfig.password,
    connectString: dbConfig.connectString
};

class RequestsManager {

    //Edmund - This function is not complete yet- It changes the SubletRequest's status to 'accepted'
    //         but does not return message, firstName, lastName and contactInfo
    static async acceptSubletRequest({email, postId, subleteeEmail}) {
        let connection;
        let reason;
        let successful = false;



        let acceptSubletRequestQuery = `UPDATE SubletRequests
                                        SET Status='accepted'  
                                        WHERE PostId=${postId} AND Email='${subleteeEmail}'`



        try {
            connection = await oracledb.getConnection(connectionInfo);
            console.log("Connection successful. Accepting sublet request");

            let acceptSubletRequestResult = await connection.execute(acceptSubletRequestQuery);


            successful = acceptSubletRequestResult.rowsAffected > 0;

            if (successful) {
                console.log(`sublet request accepted successfully`);

            } else {
                console.log(`Something went wrong, sublet request not accepted`);
                reason = "NO_ROWS_AFFECTED";
            }
        } catch (err) {
            successful = false;
            reason = err.message;
            console.log(`Something went wrong, sublet request not accepted`);
            console.log(err);
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error(err);
                }
            }
        }

        return {successful, reason};
    }




    static async createSubletRequest({email, postId, message}) {
        let connection;
        let reason;
        let successful = false;

        console.log(postId);

        let createSubletRequestQuery = `INSERT INTO SubletRequests (Email, PostId, Status, Message)
                                        VALUES ('${email}', ${postId}, 'pending', '${message}')`


        try {
            connection = await oracledb.getConnection(connectionInfo);
            console.log("Connection successful. Creating sublet request");

            let createSubletRequestResult = await connection.execute(createSubletRequestQuery);

            successful = createSubletRequestResult.rowsAffected > 0;

            if (successful) {
                console.log(`sublet request created successfully`);
            } else {
                console.log(`Something went wrong, sublet request not created`);
                reason = "NO_ROWS_AFFECTED";
            }
        } catch (err) {
            successful = false;
            reason = err.message;
            console.log(`Something went wrong, sublet request not created`);
            console.log(err);
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error(err);
                }
            }
        }

        return {successful, reason};
    }

}

module.exports = RequestsManager;
