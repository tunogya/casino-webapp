import {NextApiRequest, NextApiResponse} from "next";
const {GetCommand, UpdateCommand, DynamoDBDocumentClient} = require("@aws-sdk/lib-dynamodb");
const {DynamoDBClient} = require("@aws-sdk/client-dynamodb");

const ddbClient = new DynamoDBClient({
  region: 'ap-northeast-1',
});

const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const address = req.query.address;
  const chainId = req.query?.chainId || "5";
  // if method = get then return the data
  if (req.method === 'GET') {
    // use GetCommand to get the data
    const params = {
      TableName: 'wizardingpay',
      Key: {
        address: address,
        chainId: Number(chainId),
      },
    }
    const data = await ddbDocClient.send(new GetCommand(params));
    const user = data.Item;
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({error: "Not Found"});
    }
  } else if (req.method === 'POST') {
    let updateExpression = "SET ";
    let expressionAttributeValues = {};
    let expressionAttributeNames = {};

    for (const key in req.body) {
      if (req.body.hasOwnProperty(key)) {
        const value = req.body[key];
        updateExpression += `${key} = :${key}, `;
        expressionAttributeValues = {
          ...expressionAttributeValues,
          [`:${key}`]: value,
        }
        expressionAttributeNames = {
          ...expressionAttributeNames,
          [`#${key}`]: key,
        }
      }
    }
    updateExpression = updateExpression.slice(0, -2);

    const params = {
      TableName: 'wizardingpay',
      Key: {
        address: address,
        chainId: Number(chainId),
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    }
    const data = await ddbDocClient.send(new UpdateCommand(params));
    res.status(200).json(data);
  }
}