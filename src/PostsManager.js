const oracledb = require('oracledb');
oracledb.autoCommit = true;
oracledb.queueTimeout = 3000; // 3 seconds

const dbConfig = require('../dbconfig.js');
const connectionInfo = {
    user: dbConfig.user,
    password: dbConfig.password,
    connectString: dbConfig.connectString
};



//Not sure to check CountOutput
class PostsManager {
  static async getFilterCount() {
    let connection;
    let reason;
    let successful = false;

    let countQuery =

        `SELECT COUNT(Residence), Residence
        FROM CompleteSubletPost
        GROUP BY Residence;`

/*        `SELECT COUNT(Unittype), Unittype
        FROM CompleteSubletPost
        GROUP BY UnitType;`

        `SELECT COUNT(kitchen), kitchen
        FROM CompleteSubletPost
        GROUP BY has kitchen;`

        `SELECT COUNT(bathrooms), bathrooms
        FROM CompleteSubletPost
        GROUP BY bathrooms;`


        `SELECT COUNT(residents), residents
        FROM CompleteSubletPost
        GROUP BY residents;`
*/

    try {
        connection = await oracledb.getConnection(connectionInfo);
        console.log("Connection successful. Attempting to get count");

        let countResult = await connection.execute(countQuery);

        successful = countResult.rowsAffected > 0;

        if (successful) {
            console.log(`count successful`);
        } else {
            console.log(`Something went wrong, count not found`);
            reason = "NO_OUTPUT";
        }
    } catch (err) {
        successful = false;
        reason = err.message;
        console.log(`Something went wrong, count not found`);
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

module.exports = PostsManager;
