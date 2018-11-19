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

    static async acceptSubletRequest({email, postId, subleteeEmail}) {
        let connection;
        let reason;
        let successful = false;
        let subletRequestMessage;
        let subletRequestFirstName;
        let subletRequestLastName;
        let subletRequestContactInfo;

        let acceptSubletRequestQuery = `UPDATE SubletRequests
                                        SET Status='accepted'  
                                        WHERE PostId=${postId} AND Email='${subleteeEmail}'`

        let matchedMessageQuery = `SELECT Message 
                                   FROM SubletRequests 
                                   WHERE PostId=${postId} AND Email='${subleteeEmail}'`

        let matchedFirstNameQuery = `SELECT Firstname
                                     FROM SubleteeInfos SI, SubletRequests SR
                                     WHERE SI.Email='${subleteeEmail}'`

        let matchedLastNameQuery = `SELECT Lastname
                                    FROM SubleteeInfos SI, SubletRequests SR
                                    WHERE SI.Email='${subleteeEmail}'`

        let matchedContactInfoQuery = `SELECT ContactDescription
                                       FROM SubleteeInfos SI, SubletRequests SR
                                       WHERE SI.Email='${subleteeEmail}'`



        try {
            connection = await oracledb.getConnection(connectionInfo);
            console.log("Connection successful. Accepting sublet request");

            let acceptSubletRequestResult = await connection.execute(acceptSubletRequestQuery);

            let matchedMessageResult = await connection.execute(matchedMessageQuery);

            let matchedFirstNameResult = await connection.execute(matchedFirstNameQuery);

            let matchedLastNameResult = await connection.execute(matchedLastNameQuery);

            let matchedContactInfoResult = await connection.execute(matchedContactInfoQuery);


            successful = acceptSubletRequestResult.rowsAffected > 0;

            if (successful) {

                let messageArray = matchedMessageResult.rows[0];
                subletRequestMessage = messageArray[0];

                let firstNameArray = matchedFirstNameResult.rows[0];
                subletRequestFirstName = firstNameArray[0];

                let lastNameArray = matchedLastNameResult.rows[0];
                subletRequestLastName = lastNameArray[0];

                let contactInfoArray = matchedContactInfoResult.rows[0];
                subletRequestContactInfo = contactInfoArray[0];

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


        return {successful, reason, subletRequestMessage, subletRequestFirstName, subletRequestLastName, subletRequestContactInfo};
    }




    static async createSubletRequest({email, postId, message}) {
        let connection;
        let reason;
        let successful = false;


        let createSubletRequestQuery = `INSERT INTO SubletRequests (Email, PostId, Status ${message? ', Message' : ''})
                                        VALUES ('${email}', ${postId}, 'pending' ${message? `, ${message}` : ''})`


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
            reason = "REQUEST_ALREADY_CREATED"
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
