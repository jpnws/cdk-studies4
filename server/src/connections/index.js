"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.init = void 0;
const mysql_1 = __importDefault(require("mysql"));
const client_secrets_manager_1 = require("@aws-sdk/client-secrets-manager");
let pool;
const secrets = new client_secrets_manager_1.SecretsManagerClient({
    region: 'us-east-1',
});
const getSecretValue = async (secretId) => {
    const params = {
        SecretId: secretId,
    };
    const command = new client_secrets_manager_1.GetSecretValueCommand(params);
    const { SecretString } = await secrets.send(command);
    if (!SecretString)
        throw new Error('SecretString is empty');
    return JSON.parse(SecretString);
};
exports.init = () => {
    getSecretValue('chapter-4/rds/my-sql-instance')
        .then(({ password, username, host }) => {
        pool = mysql_1.default.createPool({
            host: process.env.RDS_HOST || host,
            user: username,
            password,
            multipleStatements: true,
            port: 3306,
            database: 'todolist',
        });
        return pool;
    })
        .catch(error => {
        console.log(error);
        return 0;
    });
};
exports.execute = (query, params) => {
    try {
        if (!pool)
            throw new Error('Pool was not created. Ensure pool is created when running the app.');
        return new Promise((resolve, reject) => {
            pool.query(query, params, (error, results) => {
                if (error) {
                    console.log(error);
                    reject(process.exit(1));
                }
                else
                    resolve(results);
            });
        });
    }
    catch (error) {
        console.error('[mysql.connector][execute][Error]: ', error);
        throw new Error('failed to execute MySQL query');
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxrREFBb0M7QUFDcEMsNEVBSXlDO0FBRXpDLElBQUksSUFBVSxDQUFDO0FBRWYsTUFBTSxPQUFPLEdBQUcsSUFBSSw2Q0FBb0IsQ0FBQztJQUN2QyxNQUFNLEVBQUUsV0FBVztDQUNwQixDQUFDLENBQUM7QUFFSCxNQUFNLGNBQWMsR0FBRyxLQUFLLEVBQUUsUUFBZ0IsRUFBRSxFQUFFO0lBQ2hELE1BQU0sTUFBTSxHQUErQjtRQUN6QyxRQUFRLEVBQUUsUUFBUTtLQUNuQixDQUFDO0lBRUYsTUFBTSxPQUFPLEdBQUcsSUFBSSw4Q0FBcUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUVsRCxNQUFNLEVBQUUsWUFBWSxFQUFFLEdBQUcsTUFBTSxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRXJELElBQUksQ0FBQyxZQUFZO1FBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0lBRTVELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNsQyxDQUFDLENBQUM7QUFFVyxRQUFBLElBQUksR0FBRyxHQUFHLEVBQUU7SUFDdkIsY0FBYyxDQUFDLCtCQUErQixDQUFDO1NBQzVDLElBQUksQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFO1FBQ3JDLElBQUksR0FBRyxlQUFLLENBQUMsVUFBVSxDQUFDO1lBQ3RCLElBQUksRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsSUFBSSxJQUFJO1lBQ2xDLElBQUksRUFBRSxRQUFRO1lBQ2QsUUFBUTtZQUNSLGtCQUFrQixFQUFFLElBQUk7WUFDeEIsSUFBSSxFQUFFLElBQUk7WUFDVixRQUFRLEVBQUUsVUFBVTtTQUNyQixDQUFDLENBQUM7UUFFSCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUMsQ0FBQztTQUNELEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUNiLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFbkIsT0FBTyxDQUFDLENBQUM7SUFDWCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQztBQUVXLFFBQUEsT0FBTyxHQUFHLENBQ3JCLEtBQWEsRUFDYixNQUEwQyxFQUM5QixFQUFFO0lBQ2QsSUFBSTtRQUNGLElBQUksQ0FBQyxJQUFJO1lBQ1AsTUFBTSxJQUFJLEtBQUssQ0FDYixvRUFBb0UsQ0FDckUsQ0FBQztRQUVKLE9BQU8sSUFBSSxPQUFPLENBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDeEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFO2dCQUMzQyxJQUFJLEtBQUssRUFBRTtvQkFDVCxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNuQixNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUN6Qjs7b0JBQU0sT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzFCLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7S0FDSjtJQUFDLE9BQU8sS0FBSyxFQUFFO1FBQ2QsT0FBTyxDQUFDLEtBQUssQ0FBQyxxQ0FBcUMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM1RCxNQUFNLElBQUksS0FBSyxDQUFDLCtCQUErQixDQUFDLENBQUM7S0FDbEQ7QUFDSCxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbXlzcWwsIHsgUG9vbCB9IGZyb20gJ215c3FsJztcbmltcG9ydCB7XG4gIEdldFNlY3JldFZhbHVlQ29tbWFuZCxcbiAgR2V0U2VjcmV0VmFsdWVDb21tYW5kSW5wdXQsXG4gIFNlY3JldHNNYW5hZ2VyQ2xpZW50LFxufSBmcm9tICdAYXdzLXNkay9jbGllbnQtc2VjcmV0cy1tYW5hZ2VyJztcblxubGV0IHBvb2w6IFBvb2w7XG5cbmNvbnN0IHNlY3JldHMgPSBuZXcgU2VjcmV0c01hbmFnZXJDbGllbnQoe1xuICByZWdpb246ICd1cy1lYXN0LTEnLFxufSk7XG5cbmNvbnN0IGdldFNlY3JldFZhbHVlID0gYXN5bmMgKHNlY3JldElkOiBzdHJpbmcpID0+IHtcbiAgY29uc3QgcGFyYW1zOiBHZXRTZWNyZXRWYWx1ZUNvbW1hbmRJbnB1dCA9IHtcbiAgICBTZWNyZXRJZDogc2VjcmV0SWQsXG4gIH07XG5cbiAgY29uc3QgY29tbWFuZCA9IG5ldyBHZXRTZWNyZXRWYWx1ZUNvbW1hbmQocGFyYW1zKTtcblxuICBjb25zdCB7IFNlY3JldFN0cmluZyB9ID0gYXdhaXQgc2VjcmV0cy5zZW5kKGNvbW1hbmQpO1xuXG4gIGlmICghU2VjcmV0U3RyaW5nKSB0aHJvdyBuZXcgRXJyb3IoJ1NlY3JldFN0cmluZyBpcyBlbXB0eScpO1xuXG4gIHJldHVybiBKU09OLnBhcnNlKFNlY3JldFN0cmluZyk7XG59O1xuXG5leHBvcnQgY29uc3QgaW5pdCA9ICgpID0+IHtcbiAgZ2V0U2VjcmV0VmFsdWUoJ2NoYXB0ZXItNC9yZHMvbXktc3FsLWluc3RhbmNlJylcbiAgICAudGhlbigoeyBwYXNzd29yZCwgdXNlcm5hbWUsIGhvc3QgfSkgPT4ge1xuICAgICAgcG9vbCA9IG15c3FsLmNyZWF0ZVBvb2woe1xuICAgICAgICBob3N0OiBwcm9jZXNzLmVudi5SRFNfSE9TVCB8fCBob3N0LFxuICAgICAgICB1c2VyOiB1c2VybmFtZSxcbiAgICAgICAgcGFzc3dvcmQsXG4gICAgICAgIG11bHRpcGxlU3RhdGVtZW50czogdHJ1ZSxcbiAgICAgICAgcG9ydDogMzMwNixcbiAgICAgICAgZGF0YWJhc2U6ICd0b2RvbGlzdCcsXG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHBvb2w7XG4gICAgfSlcbiAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuXG4gICAgICByZXR1cm4gMDtcbiAgICB9KTtcbn07XG5cbmV4cG9ydCBjb25zdCBleGVjdXRlID0gPFQ+KFxuICBxdWVyeTogc3RyaW5nLFxuICBwYXJhbXM6IHN0cmluZ1tdIHwgUmVjb3JkPHN0cmluZywgdW5rbm93bj4sXG4pOiBQcm9taXNlPFQ+ID0+IHtcbiAgdHJ5IHtcbiAgICBpZiAoIXBvb2wpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdQb29sIHdhcyBub3QgY3JlYXRlZC4gRW5zdXJlIHBvb2wgaXMgY3JlYXRlZCB3aGVuIHJ1bm5pbmcgdGhlIGFwcC4nLFxuICAgICAgKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZTxUPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBwb29sLnF1ZXJ5KHF1ZXJ5LCBwYXJhbXMsIChlcnJvciwgcmVzdWx0cykgPT4ge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgcmVqZWN0KHByb2Nlc3MuZXhpdCgxKSk7XG4gICAgICAgIH0gZWxzZSByZXNvbHZlKHJlc3VsdHMpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignW215c3FsLmNvbm5lY3Rvcl1bZXhlY3V0ZV1bRXJyb3JdOiAnLCBlcnJvcik7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdmYWlsZWQgdG8gZXhlY3V0ZSBNeVNRTCBxdWVyeScpO1xuICB9XG59O1xuIl19