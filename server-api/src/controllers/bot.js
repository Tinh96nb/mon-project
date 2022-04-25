const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot("5215374887:AAEFI0edL8Miejnj-vMfmNSaFIE5rgxcKiQ", {
  polling: true,
});
const knex = require('../models/connect');

const pushEvent = async (ctx, next) => {
  const { pass = '', content = ''} = ctx.request.query
  if (pass !== '123@abc') return ctx.body = '';
  await bot.sendMessage("@rikviptinh", content, { parse_mode: "Markdown" });
  ctx.body = ctx.request.body;
}

const saveData = async (ctx, next) => {
  const { pass = '', date = '', result = '', duplicate = 1 } = ctx.request.query
  if (pass !== '123@abc') return ctx.body = '';
  await knex('rikvip').insert({
    date,
    result,
    duplicate
  })
  ctx.body = 'done';
}

module.exports = { pushEvent, saveData }