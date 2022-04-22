const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot("5215374887:AAEFI0edL8Miejnj-vMfmNSaFIE5rgxcKiQ", {
  polling: true,
});

const pushEvent = async (ctx, next) => {
  const { pass = '', type = '', amount = 0, target = ''} = ctx.request.body
  if (pass !== '123@abc') return ctx.body = '';
  await bot.sendMessage("@rikviptinh", `Kèo liên tiếp ${type} ${amount} nháy. Đánh ${target} nào!`);
  ctx.body = ctx.request.body;
}

module.exports = { pushEvent }