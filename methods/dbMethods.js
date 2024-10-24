// ========= IMPORTS ========= //
// local
const { db } = require("../services/config.js");

// ========= CONTROLLERS ========= //
const dbMethods = {
  // ---------------------------------------------------------------------------------------------------------------------------------- //
  // GET USER INFO FROM AIRTABLE
  getUserInformationsFromAirtable: async (userId) => {
    const records = await db("users")
      .select({ filterByFormula: `{id} = "${userId}"` })
      .all();

    if (records.length === 0) {
      console.log("Aucun utilisateur trouvé avec cet UID");
      return null;
    }

    const userInfo = records[0].fields;
    return userInfo;
  },

  // ---------------------------------------------------------------------------------------------------------------------------------- //
  // GET WEBHOOKS BY USER FROM AIRTABLE
  getUserWebhooks: async (userId) => {
    const records = await db("webhooks")
      .select({ filterByFormula: `{userId} = "${userId}"` })
      .all();

    if (records.length === 0) {
      console.log("Aucun webhook trouvé pour cet utilisateur");
      return null;
    }

    const userWebhooks = records.map((record) => record.fields);
    return userWebhooks;
  },

  // ---------------------------------------------------------------------------------------------------------------------------------- //
  // REGISTER USER INFO IN AIRTABLE
  registerUserInformationsInAirtable: async (objectUserInfo) => {
    const { id, lastname, firstname, username, email, birthdate } = objectUserInfo;
    await db("users").create([
      {
        fields: {
          id: id,
          lastname: lastname,
          firstname: firstname,
          username: username,
          email: email,
          birthdate: birthdate,
        },
      },
    ]);
  },

  // ---------------------------------------------------------------------------------------------------------------------------------- //
  // REGISTER A NEW LIVE ALERTS SUBSCRIPTION IN AIRTABLE
  registerLiveAlertsSubscriptionInAirtable: async (objectSubscriptionInfo) => {
    const { webhookId, streamerId, streamCount, webhookType, userId } = objectSubscriptionInfo;
    await db("webhooks").create([
      {
        fields: {
          webhookId: webhookId,
          streamerId: streamerId,
          streamCount: streamCount,
          webhookType: webhookType,
          userId: userId,
        },
      },
    ]);
  },

  // ---------------------------------------------------------------------------------------------------------------------------------- //
  // DELETE A LIVE ALERTS SUBSCRIPTION IN AIRTABLE BY WEBHOOK ID
  deleteLiveAlertsSubscriptionInAirtable: async (webhookId) => {
    const records = await db("webhooks")
      .select({ filterByFormula: `{webhookId} = "${webhookId}"` })
      .all();

    if (records.length === 0) {
      console.log("Aucun abonnement trouvé avec cet ID de webhook");
      return null;
    }

    const subscriptionToDelete = records[0];
    await db("webhooks").destroy(subscriptionToDelete.id);
  },
};

module.exports = dbMethods;
