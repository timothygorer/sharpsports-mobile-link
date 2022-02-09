import { hashVals } from "./helpers";
import DataDogJsonLogger from './datadog';
const logger = new DataDogJsonLogger

export const postContext = async(url: string, internalId: string, publicKey: string, privateKey: string) => {

  const data = {
    internalId: internalId,
    bettorToken: hashVals(internalId,privateKey)
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Token ${publicKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return response.json();
}

//send Login information back to sharpsports API
export const sendLogin = (args: any) => {

  const HEADERS = {
      "Authorization":`Token b4c9eb079c804f6da027830bfc29df27b4c9eb07`,
      "Content-Type": "application/json"
  };
  const DATA = {
    status: args.status,
    ui: args.ui,
    cid: args.cid,
    eventType: args.eventType,
    balance: args.balance,
    action: args.actions,
    bookAccountId: args.bookAccountId
  };
    
  //send Login requests to appropriate bettorAccount
  fetch(`http://localhost:8000/v1/bettorAccounts/${args.bettorAccountId}/verify`, {
    method: 'PUT',
    headers: HEADERS,
    body: JSON.stringify(DATA),
  }).then((response) => {
    if (response.status != 200){
      logger.error(`Bad response sending Login - ${response.status}`,{})
    }
  }).catch((err) => logger.error(`Could not process login info - ${err}`,{}));
}

//send bets to Sharpsports mobile bet handler
export const sendBets = async(bettorAccountId: string, messageData: any, bets: any) => {

  const HEADERS = {
    Authorization: "Token b4c9eb079c804f6da027830bfc29df27b4c9eb07",
    "Content-Type": "application/json"
  }

  const PAYLOAD = {
    bets: bets,
    messageData: messageData
  }

  const OPTS = {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(PAYLOAD)
  }

  fetch(`http://localhost:8000/v1/mobileBets/${bettorAccountId}`,OPTS).then((response) => {
    if (response.status != 200){
      logger.error(`Bad Response Sending Bets - ${response.status}`,{})
    } else {
      console.log("Send Bets Successfully")
    }
  }).catch((err) => logger.error(`Could not process bets - ${err}`,{}));
}

//send refresh request for manual refresh button
export const refreshRequest = (internalId: string, publicKey: string, privateKey: string) => {

  const HEADERS = {
    "Authorization": `Token ${publicKey}`
  }

  const OPTS = {
    headers: HEADERS,
    method: "POST"
  }

  const auth = hashVals(internalId,privateKey)
  fetch(`http://localhost:8000/v1/bettors/${internalId}/refresh?auth=${auth}`,OPTS).catch((err) => {
    logger.error(`Error sending refresh requests - ${err}`,{internalId:internalId})
  });
}