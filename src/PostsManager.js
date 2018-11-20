const oracledb = require('oracledb');
oracledb.autoCommit = true;
oracledb.queueTimeout = 3000; // 3 seconds

const dbConfig = require('../dbconfig.js');
const connectionInfo = {
    user: dbConfig.user,
    password: dbConfig.password,
    connectString: dbConfig.connectString
};




class PostsManager {

    static async getFilterCount() {
      let connection;
      let reason;
      let successful = false;


      let resCount = [];
      let typeCount = [];
      let kitchenCount = [];
      let bathroomCount = [];
      let residentsCount = [];

      let countResQuery =
          `SELECT Residence, COUNT(Residence)
          FROM CompletePosts
          GROUP BY Residence`


      let countUnittypeQuery =
          `SELECT UnitType, COUNT(UnitType)
          FROM CompletePosts
          GROUP BY UnitType`

      let countKitchenQuery =
          `SELECT Kitchens, COUNT(Kitchens)
          FROM CompletePosts
          GROUP BY Kitchens`

     let countBathroomQuery =
          `SELECT Bathrooms, COUNT(Bathrooms)
          FROM CompletePosts
          GROUP BY Bathrooms`


   let countResidentsQuery =
          `SELECT Residents, COUNT(Residents)
          FROM CompletePosts
          GROUP BY Residents`

      try {

          connection = await oracledb.getConnection(connectionInfo);
          console.log("Connection successful. Attempting to get count");

          let countResResult = await connection.execute(countResQuery);
          let countUnitResult = await connection.execute(countUnittypeQuery);
          let countKitchenResult = await connection.execute(countKitchenQuery);
          let countBathResult = await connection.execute(countBathroomQuery);
          let countResidentsResult = await connection.execute(countResidentsQuery);


          successful = countResResult.rows.length > 0;

          if (successful) {

            resCount = countResResult.rows.map((row)=>{
              return {
                value: row[0],
                count: row[1]
              };
            });


            typeCount = countUnitResult.rows.map((row)=>{
              return {
                value: row[0],
                count: row[1]
              };
            });



            kitchenCount = countKitchenResult.rows.map((row)=>{
              return {
                value: row[0],
                count: row[1]
              };
            });



            bathroomCount = countBathResult.rows.map((row)=>{
              return {
                value: row[0],
                count: row[1]
              };
            });


            residentsCount = countResidentsResult.rows.map((row)=>{
              return {
                value: row[0],
                count: row[1]
              };
            });



         console.log(`count successful`);

        }


          else {
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

      return {successful, reason, resCount, typeCount, kitchenCount, bathroomCount, residentsCount};
    }




    static async getCreatePostInfo({email}) {
        let connection;
        let reason;
        let successful = false;
        let residences = [];
        let unitTypes = [];


        let residencesQuery = `SELECT residencename
                            FROM residences`

       let unitTypesQuery = `SELECT unittypename
                           FROM unittypes`


        try {
            connection = await oracledb.getConnection(connectionInfo);
            console.log("Connection successful. Attempting to get History Items");

            let residencesResult = await connection.execute(residencesQuery);
            let unitTypesResult = await connection.execute(unitTypesQuery);

            successful = residencesResult.rows.length > 0 ;

            if (successful) {

              residences = residencesResult.rows.map((row)=>{
                 return row[0]
              });



              unitTypes = unitTypesResult.rows.map((row)=>{
                 return  row[0]
              });


                console.log(`Returned createPost Info for user ${email}`);
            } else {

                console.log(`Something went wrong, Info not found`);
                reason = "NOT_FOUND";
            }
        } catch (err) {
            successful = false;
            reason = err.message;
            console.log(`Something went wrong, Info not found`);
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

        return {successful, reason, residences, unitTypes};
    }





}

module.exports = PostsManager;
