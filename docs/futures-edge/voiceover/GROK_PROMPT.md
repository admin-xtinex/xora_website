# Grok Build prompt: all Futures Edge voiceovers

Paste everything below the line into Grok Build, inside the xora_website project.
26 videos, 1288 clips, about 100,693 characters. T09 is already recorded and is not included.

---

Record the voiceovers for all XORA Futures Edge video lessons, phase by phase, one video at a time.
After each video is finished, push it to GitHub, then start the next one. Continue until every video is done.
The complete script for every video is at the end of this prompt.

VOICE
- xAI text-to-speech, voice "luna", exactly the same settings as lesson T09 (already recorded).
- A warm, clear, patient female tutor, about 150 words a minute. Lines marked [firmer, slower] are risks and
  warnings: read them a little slower and firmer, and do not speak the marker itself.
- Read the API key from an environment variable. Never write it into any file or commit.
- Same voice and settings for every clip of every video.

WHAT TO SAY
- Each script line is: <file> | <text to speak>. Speak exactly the text after the "|" (numbers and symbols are
  already written out the way they should be said, e.g. "B-T-C", "sixty thousand").
- Save each clip as content/futures-edge/<ID>/voice/<file>, e.g. content/futures-edge/T02/voice/00.mp3.
- If the API supports context, pass the previous and next line's text, so sentences flow naturally.

ORDER (video and number of clips)
V00 37, T01 48, T02 52, T03 43, T04 46, CP1 38, T05 46, T06 47, T07 54, T08 51, T10 52, T11 48, T12 54, T13 52, CPA 38, T14 60, T15 58, T16 57, T17 53, T18 57, T19 54, T20 44, T21 49, T22 50, T23 61, CPB 39

FOR EACH VIDEO <ID>, IN THAT ORDER
1. git pull origin main
2. If git log --oneline already has a commit "Futures Edge: <ID> voiceover (Grok voice luna)", the video is done:
   skip it. (This lets you resume after an interruption.)
3. Delete any old clips in content/futures-edge/<ID>/voice/ (V00 and T01 have old ones from another voice).
4. Generate every clip of that video from the script below.
5. Check the number of mp3 files equals the clip count, and none is empty. If a clip fails, retry up to 3 times;
   if it still fails, stop and report the video and line.
6. Run: node tools/futures-edge-lessons/build-lesson.mjs <ID>   (needs ffmpeg; it trims silence and fits timing).
   If the build fails, stop and report the error.
7. Commit content/futures-edge/<ID>/voice/ and public/futures-edge/lessons/<ID>* with the message
   "Futures Edge: <ID> voiceover (Grok voice luna)".
8. git pull origin main, then git push origin main (retry up to 3 times if rejected; never use --force).
9. Report "<ID> done: <N> clips, pushed" and go straight to the next video.

RULES
- Do not edit narration.json, scene files, or anything outside content/futures-edge/<ID>/voice/ and
  public/futures-edge/lessons/<ID>*.
- When every video is done, list all videos with their clip counts.

COMPLETE SCRIPT
(If any line here differs from docs/futures-edge/voiceover/<ID>.json in the repo, the repo file wins.)

## Start here


### V00 · to XORA Futures Edge (37 clips → content/futures-edge/V00/voice/)

00.mp3 | At first, markets look like noise. This course teaches you to read them, step by step.
01.mp3 | Hi, I'm your Zora tutor! Welcome to Futures Edge.
02.mp3 | Twenty-three short lessons, five phases, and no experience needed. Pause and replay any time.
03.mp3 | Never traded before? Not sure what B T C, or U S D T means? That's completely fine. [firmer, slower]
04.mp3 | Every new word is explained before we use it.
05.mp3 | Each lesson works in five ways.
06.mp3 | Watch a short animation.
07.mp3 | Read simple notes.
08.mp3 | Flip through short slides.
09.mp3 | Try it yourself, with fictional prices.
10.mp3 | Then take a quick quiz. Every answer is explained.
11.mp3 | Here's the path we'll walk together.
12.mp3 | First, crypto foundations: what crypto is, and why prices move.
13.mp3 | Then trading basics: long and short, orders, profit, loss and fees.
14.mp3 | Next, how futures work, with margin, leverage and liquidation. [firmer, slower]
15.mp3 | Then reading charts: candlesticks, trends and key levels.
16.mp3 | And finally, scalping and risk management. [firmer, slower]
17.mp3 | Three short checkpoints show you what to review.
18.mp3 | Before we start: this course is for learning and demo practice only.
19.mp3 | There's no live trading, and no real money.
20.mp3 | We will never ask for your passwords, O T P codes, or A P I keys. [firmer, slower]
21.mp3 | And every price you see is fictional.
22.mp3 | Practise first. Real money is never needed here. [firmer, slower]
23.mp3 | Futures can lose money quickly. [firmer, slower]
24.mp3 | Leverage makes losses bigger, not just gains. [firmer, slower]
25.mp3 | Fees can turn a small win into a loss. [firmer, slower]
26.mp3 | And signals can be wrong. [firmer, slower]
27.mp3 | So you always have three choices: buy, sell, or wait. [firmer, slower]
28.mp3 | If you're not sure, waiting is a decision too. [firmer, slower]
29.mp3 | By the end, you should be able to:
30.mp3 | read the B T C, U S D T pair,
31.mp3 | Read a candlestick chart,
32.mp3 | Tell spot from futures,
33.mp3 | Explain why leverage is risky, [firmer, slower]
34.mp3 | And know when not to trade.
35.mp3 | One lesson at a time.
36.mp3 | Up next: lesson one. What is cryptocurrency? See you there!

## Phase 1 · Crypto Foundations


### T01 · What Is Cryptocurrency? (48 clips → content/futures-edge/T01/voice/)

00.mp3 | Lesson one: what is cryptocurrency? Let's start at the very beginning.
01.mp3 | You've probably seen a screen like this. Prices that never sit still. [firmer, slower]
02.mp3 | B-T-C keeps moving. But what is B-T-C, really? By the end of this lesson, you'll know.
03.mp3 | Let's start with money. Money is value that people agree to accept.
04.mp3 | You hand it over, and you get food, a bus ticket, or rent paid.
05.mp3 | And most money today is already just numbers, stored in a bank's computers.
06.mp3 | Value is what something is worth to people. Money is a shared way to store and exchange it.
07.mp3 | A digital asset is anything of value that exists only as digital records.
08.mp3 | A bank balance. Points in a game. Airline miles.
09.mp3 | Cryptocurrency is one kind of digital asset, like B-T-C and E-T-H. But not every digital asset is crypto.
10.mp3 | Here's the key idea. Say a friend sends you a small amount of crypto.
11.mp3 | The payment is written into a shared record, called a ledger.
12.mp3 | Many computers around the world keep a copy, and they check each other.
13.mp3 | The records are grouped into blocks, linked in order. That's the blockchain.
14.mp3 | So there's no bank in the middle. The network keeps the record.
15.mp3 | Meet Bitcoin, symbol B T C: the first and best-known cryptocurrency.
16.mp3 | It launched in two thousand nine, and no more than twenty-one million bitcoin can ever exist.
17.mp3 | One bitcoin can be split into tiny parts, so you can own a small piece, like zero point zero zero two B T C.
18.mp3 | Here's a common mistake. There is no coin inside your phone. [firmer, slower]
19.mp3 | A wallet holds keys, which prove you control your crypto. The coins themselves are entries on the blockchain.
20.mp3 | On an exchange, the exchange holds the keys for you. Lose your keys, and you can lose access.
21.mp3 | Two words you'll hear: coins and tokens. A coin runs on its own blockchain.
22.mp3 | A token is built on top of an existing one. U S D T is a token designed to track the US dollar.
23.mp3 | Now a worked example. What is my B-T-C worth?
24.mp3 | Say you hold zero point zero zero two B T C, and one B T C costs sixty thousand U S D T.
25.mp3 | Amount times price: one hundred and twenty U S D T. That's all it is.
26.mp3 | Now watch what happens when the price moves.
27.mp3 | The price rises to sixty-three thousand. Your value rises to one hundred and twenty-six.
28.mp3 | Then it falls to fifty-seven thousand. Your value falls to one hundred and fourteen.
29.mp3 | Notice: you still hold the same zero point zero zero two B T C. Only its value changed.
30.mp3 | Your turn. You hold zero point zero zero two B T C, and the price is sixty-five thousand U S D T. What is it worth? Pause if you need more time.
31.mp3 | The answer: one hundred and thirty U S D T. Well done if you got it.
32.mp3 | Quick check: crypto, or not crypto?
33.mp3 | Bitcoin: crypto. Game points: not crypto. Ether: crypto. A bank balance: not crypto.
34.mp3 | And U S D T? It counts too. It's a crypto token.
35.mp3 | Before you go further, know the risks. [firmer, slower]
36.mp3 | No government stands behind crypto. If something goes wrong, nobody has to pay you back. [firmer, slower]
37.mp3 | Prices can rise or fall a lot in a single day. [firmer, slower]
38.mp3 | Lose your keys, or get tricked by a scammer, and your crypto can be gone for good. [firmer, slower]
39.mp3 | And owning B-T-C is not the same as trading futures, which are contracts about its price. We'll cover those later. [firmer, slower]
40.mp3 | Learn first, and never risk money you can't afford to lose. [firmer, slower]
41.mp3 | Let's recap.
42.mp3 | Cryptocurrency is a digital asset recorded on a shared blockchain.
43.mp3 | A wallet holds keys. The coins live on the blockchain.
44.mp3 | And value equals amount times price. The amount stays; the value moves.
45.mp3 | Check yourself: if B T C falls ten percent, what happens to your zero point zero zero two B T C?
46.mp3 | You still hold zero point zero zero two B T C. Its value falls by ten percent.
47.mp3 | Great start! Next up: why do crypto prices move? See you in lesson two.

### T02 · Why Do Crypto Prices Move? (52 clips → content/futures-edge/T02/voice/)

00.mp3 | Lesson two: why do crypto prices move? Let's find out who really sets the price.
01.mp3 | Here's a puzzle. At ten o'clock, B-T-C costs sixty thousand U-S-D-T.
02.mp3 | A minute later it's higher. Then lower. Nobody pressed a button.
03.mp3 | So who decides? Buyers and sellers.
04.mp3 | Every price comes from a market: people who want to buy, and people who want to sell.
05.mp3 | A buyer pays to get B-T-C. A seller gives up B-T-C to get paid.
06.mp3 | When a buyer and a seller agree on a price, a trade happens.
07.mp3 | The price of the latest trade is what we call the market price.
08.mp3 | Demand means how much people want to buy, and at what price.
09.mp3 | Think of the last mangoes at a busy stall. When many want them, the seller can ask more.
10.mp3 | Here, more buyers arrive than sellers. To get B-T-C, buyers offer a little more.
11.mp3 | Each new trade is a bit higher, so the price ticks up.
12.mp3 | Supply means how much people want to sell, and at what price.
13.mp3 | Think of a fish seller near closing time with lots left. To sell it all, she cuts her price.
14.mp3 | Now more sellers arrive than buyers. To find a buyer, sellers accept less.
15.mp3 | We call this selling pressure. The price ticks down.
16.mp3 | Let's measure a move. Change is the new price minus the old price.
17.mp3 | From sixty thousand to sixty-one thousand two hundred U-S-D-T, the change is plus one thousand two hundred U-S-D-T.
18.mp3 | As a percent: one thousand two hundred divided by sixty thousand, times one hundred, is two percent.
19.mp3 | From sixty thousand down to fifty-seven thousand: minus three thousand U-S-D-T, or minus five percent.
20.mp3 | Now a simple model to watch. It's illustrative only, not a prediction of real markets.
21.mp3 | Buyers stronger than sellers? The model price drifts up.
22.mp3 | Sellers stronger? It drifts down.
23.mp3 | When both sides are about equal, the price wobbles sideways, with no clear direction.
24.mp3 | Careful: price doesn't simply follow how many people are buying or selling.
25.mp3 | Here, three buyers each want four B-T-C. That's twelve B-T-C in total.
26.mp3 | And ten sellers offer only zero point two B-T-C each. That's just two B-T-C.
27.mp3 | Fewer people, but far more B-T-C wanted. Size matters, not headcount.
28.mp3 | Liquidity means how easily you can buy or sell without moving the price much.
29.mp3 | Left: a busy market with lots of B-T-C for sale at each price. Right: a quiet one.
30.mp3 | Now someone buys one B-T-C, in both markets.
31.mp3 | Busy market: the price stays put. Quiet market: it jumps four hundred U-S-D-T.
32.mp3 | Volatility is how much and how fast a price swings.
33.mp3 | A calm market moves a little. A volatile one swings hard, up and down.
34.mp3 | Surprise news, or a quiet market with few orders, can cause sudden jumps.
35.mp3 | Crypto is known for high volatility.
36.mp3 | A common mistake: picturing price as a smooth line you can simply follow. [firmer, slower]
37.mp3 | Zoom in, and real price paths are jagged, full of small ups and downs. [firmer, slower]
38.mp3 | Nobody knows the next tick. A neat trend can turn around at any moment. [firmer, slower]
39.mp3 | Your turn. B-T-C moves from sixty thousand to sixty-three thousand U-S-D-T. What's the change, in U-S-D-T and in percent?
40.mp3 | Answer: plus three thousand U-S-D-T. And three thousand divided by sixty thousand, times one hundred, is five percent.
41.mp3 | Before you go further, know the risks. [firmer, slower]
42.mp3 | News or a quiet market can move prices fast, in either direction. [firmer, slower]
43.mp3 | Nobody knows the next move. Not experts, not apps, not AI. [firmer, slower]
44.mp3 | When things look unclear, you can always wait. Not trading is a valid choice. [firmer, slower]
45.mp3 | And remember: today's model was illustrative, not real market data. [firmer, slower]
46.mp3 | Let's recap. Prices move as buyers and sellers trade. The latest trade is the market price.
47.mp3 | More demand tends to push price up. More supply tends to push it down.
48.mp3 | Liquidity and news shape how fast and how far it moves.
49.mp3 | Check yourself: many sellers, few buyers. Which way does price tend to move?
50.mp3 | Down, as sellers accept less. But nothing is guaranteed.
51.mp3 | Great work! Next up: trading pairs, and what B-T-C U-S-D-T really means.

### T03 · Trading Pairs: BTC/USDT (43 clips → content/futures-edge/T03/voice/)

00.mp3 | Lesson three: trading pairs. What does B-T-C U-S-D-T really mean? Let's find out.
01.mp3 | Look at a shop price tag. Rice: sixty rupees for one kilo.
02.mp3 | It compares two things: an amount of money, and one unit of the item.
03.mp3 | A crypto price works the same way: sixty thousand U-S-D-T for one B-T-C.
04.mp3 | A trading pair tells you which asset is being priced against another.
05.mp3 | The first half, B-T-C, is the base asset: the thing you buy or sell.
06.mp3 | The second half, U-S-D-T, is the quote asset: what the price is counted in.
07.mp3 | So B-T-C U-S-D-T means: the price of one B-T-C, in U-S-D-T.
08.mp3 | A symbol is the short name for a pair. Many apps drop the slash: B-T-C U-S-D-T.
09.mp3 | B-T-C slash U-S-D-T, and B-T-C U-S-D-T written as one word, are the same pair. E-T-H U-S-D-T is E-T-H priced in U-S-D-T.
10.mp3 | Read the price as: one B-T-C costs sixty thousand U-S-D-T.
11.mp3 | U-S-D-T is a stablecoin: a token designed to stay close to one US dollar.
12.mp3 | B-T-C's price swings a lot. U-S-D-T's price is designed to barely move.
13.mp3 | That makes it a handy measuring stick for prices. But designed to stay is not guaranteed.
14.mp3 | Quantity is how much of the base asset you buy or sell.
15.mp3 | Think of one B-T-C as a big block, cut into one thousand small pieces.
16.mp3 | One piece is zero point zero zero one B-T-C. At sixty thousand U-S-D-T per B-T-C, it's worth just sixty U-S-D-T.
17.mp3 | The price per B-T-C stays the same.
18.mp3 | Notional value is the total worth of a quantity, counted in the quote asset.
19.mp3 | The formula: value in U-S-D-T equals B-T-C amount times U-S-D-T per B-T-C.
20.mp3 | Say you buy zero point zero five B-T-C at sixty thousand U-S-D-T per B-T-C. Zero point zero five times sixty thousand is three thousand U-S-D-T.
21.mp3 | Now let the price move, and watch two orders: one B-T-C and zero point zero zero one B-T-C.
22.mp3 | B-T-C rises to sixty-three thousand. One B-T-C is now worth sixty-three thousand U-S-D-T. Zero point zero zero one B-T-C: sixty-three U-S-D-T.
23.mp3 | Both rose five percent. In U-S-D-T, that's three thousand more versus just three more.
24.mp3 | If B-T-C falls to fifty-seven thousand, they're worth fifty-seven thousand and fifty-seven U-S-D-T.
25.mp3 | A common mistake: B-T-C costs sixty thousand U-S-D-T, so I need sixty thousand U-S-D-T to trade it. [firmer, slower]
26.mp3 | No. Sixty thousand is the price of one whole B-T-C, not the size of your order. [firmer, slower]
27.mp3 | You choose the quantity. Zero point zero zero one B-T-C at sixty thousand costs sixty U-S-D-T, before fees. [firmer, slower]
28.mp3 | Your turn. Quantity: zero point zero two B-T-C. Price: sixty-five thousand U-S-D-T per B-T-C. What's the notional value?
29.mp3 | Zero point zero two times sixty-five thousand is one thousand three hundred U-S-D-T. Well done if you got it.
30.mp3 | Other pairs work the same way. E-T-H U-S-D-T: one E-T-H costs three thousand U-S-D-T.
31.mp3 | The quote doesn't have to be U-S-D-T. In E-T-H B-T-C, the price is counted in B-T-C.
32.mp3 | E-T-H B-T-C at zero point zero five means one E-T-H costs zero point zero five B-T-C.
33.mp3 | Before you go further: stablecoins have risks too. [firmer, slower]
34.mp3 | A stablecoin is not guaranteed to stay at one dollar. It can slip, and that's called losing its peg. [firmer, slower]
35.mp3 | It depends on the company behind it, and on the money it holds in reserve. [firmer, slower]
36.mp3 | And notional value isn't profit. It's just what your B-T-C is worth right now. [firmer, slower]
37.mp3 | Let's recap. A pair prices the base asset in the quote asset: U-S-D-T per one B-T-C.
38.mp3 | Value in U-S-D-T equals B-T-C amount times U-S-D-T per B-T-C.
39.mp3 | U-S-D-T is a stablecoin. It aims for one dollar, but that's not guaranteed.
40.mp3 | Check yourself: you buy zero point zero one B-T-C at sixty thousand U-S-D-T. What's the notional value?
41.mp3 | Zero point zero one times sixty thousand is six hundred U-S-D-T.
42.mp3 | Well done! Next up: what does an exchange do? See you in lesson four.

### T04 · What Does an Exchange Do? (46 clips → content/futures-edge/T04/voice/)

00.mp3 | Lesson four: what does an exchange do? Let's look inside the marketplace.
01.mp3 | An exchange is a business that runs a marketplace where people buy and sell assets.
02.mp3 | Like a big market hall: it brings buyers and sellers together, and keeps the record.
03.mp3 | A trading platform is the app or website you use to reach it.
04.mp3 | An order is an instruction: buy or sell, how much, and at what price.
05.mp3 | This one says: buy zero point zero one B-T-C at sixty thousand U-S-D-T. That's six hundred U-S-D-T in total.
06.mp3 | If nobody sells at that price yet, the order waits in a list.
07.mp3 | The order book is a live list of waiting orders, sorted by price.
08.mp3 | Sell orders sit on top. The cheapest one is closest to the middle.
09.mp3 | Buy orders sit below. The highest one is closest to the middle.
10.mp3 | New orders keep arriving and leaving, so the book changes all the time.
11.mp3 | Two prices matter most. The bid is the highest price a buyer is waiting to pay.
12.mp3 | The ask is the lowest price a seller is waiting to accept.
13.mp3 | Here the bid is fifty-nine thousand nine hundred ninety U-S-D-T, and the ask is sixty thousand ten U-S-D-T.
14.mp3 | The spread is the gap between them: the ask minus the bid.
15.mp3 | Sixty thousand ten minus fifty-nine thousand nine hundred ninety is a spread of twenty U-S-D-T.
16.mp3 | Now a new buyer offers sixty thousand. The best bid moves up, and the spread shrinks to ten.
17.mp3 | In a quiet market with few orders, the spread is often wider.
18.mp3 | Matching: the exchange pairs orders whose prices meet.
19.mp3 | A buyer wants zero point three B-T-C and will pay up to sixty thousand twenty U-S-D-T.
20.mp3 | First, zero point two B-T-C fills at the best ask, sixty thousand ten.
21.mp3 | The other zero point one B-T-C fills at the next ask, sixty thousand twenty.
22.mp3 | Total: zero point three B-T-C for eighteen thousand four U-S-D-T. The last trade price is now sixty thousand twenty.
23.mp3 | Your turn. A buyer wants zero point one B-T-C, paying up to sixty thousand fifteen U-S-D-T. Which sell orders fill it?
24.mp3 | Zero point zero five B-T-C at sixty thousand ten, then zero point zero five B-T-C at sixty thousand fifteen. The sixty thousand thirty order is above the limit.
25.mp3 | Total cost: three thousand point five plus three thousand point seven five, which is six thousand one point two five U-S-D-T.
26.mp3 | Binance is one large crypto exchange. There are many others.
27.mp3 | The screens in this course are generic mocks, not real exchange screens.
28.mp3 | Real apps change their labels over time, so check the app's own help pages.
29.mp3 | Important: an exchange is not a bank. [firmer, slower]
30.mp3 | Money you keep there is usually not protected the way a bank deposit is. [firmer, slower]
31.mp3 | Exchanges can pause withdrawals, get hacked, or even shut down. [firmer, slower]
32.mp3 | And the rules differ from country to country. [firmer, slower]
33.mp3 | Phishing is a fake message or website that tries to steal your login. [firmer, slower]
34.mp3 | Spot the red flags. Pressure: urgent, act now, or your account will be locked. [firmer, slower]
35.mp3 | A look-alike address with a small spelling change. And a request for your O-T-P. [firmer, slower]
36.mp3 | Safer habits: type the address yourself or use a bookmark, and never share codes. [firmer, slower]
37.mp3 | Account security means keeping other people out of your account. [firmer, slower]
38.mp3 | Never share your password, your O-T-P codes, or A-P-I secret keys. Not with anyone. [firmer, slower]
39.mp3 | Real support staff will never ask for them. Turn on two-step verification too. [firmer, slower]
40.mp3 | Let's recap. An exchange runs a marketplace. Orders wait in the order book until prices meet.
41.mp3 | Bid is the best buy price, ask the best sell price. The spread is ask minus bid.
42.mp3 | An exchange is not a bank. Never share passwords, OTPs or A-P-I keys. [firmer, slower]
43.mp3 | Check yourself: best bid fifty-nine thousand nine hundred ninety, best ask sixty thousand ten. What's the spread?
44.mp3 | Sixty thousand ten minus fifty-nine thousand nine hundred ninety is twenty U-S-D-T.
45.mp3 | That's Phase one! Next up: the Foundations Checkpoint, a short review of lessons one to four.

### CP1 · Foundations Checkpoint (38 clips → content/futures-edge/CP1/voice/)

00.mp3 | Checkpoint one. Let's see how much of Phase one you remember.
01.mp3 | Welcome to your first checkpoint: eight quick questions on lessons T one to T four.
02.mp3 | Read each question, pick an answer, and pause the video whenever you need more time. [firmer, slower]
03.mp3 | It's not graded. Missing one just shows you what to revisit.
04.mp3 | Question one, from T one. What is a cryptocurrency? Choose A, B, C or D.
05.mp3 | It's A. Crypto is a digital asset recorded on a shared public ledger: the blockchain.
06.mp3 | B is tempting, but your phone holds keys, not coins. The coins are entries on the ledger.
07.mp3 | Question two, from T one. You hold zero point zero zero five B-T-C, and one B-T-C costs sixty thousand U-S-D-T. What is it worth?
08.mp3 | It's B, three hundred U-S-D-T. Value is amount times price: zero point zero zero five times sixty thousand.
09.mp3 | C is a decimal slip. Three thousand U-S-D-T is what zero point zero five B-T-C would be worth, ten times more.
10.mp3 | Question three, from T two. Suddenly far more people want to buy than to sell. What tends to happen?
11.mp3 | A. Buyers compete for the few sellers and offer more, so the price tends to rise.
12.mp3 | But B is wrong: nothing is guaranteed. News or thin trading can turn the price quickly.
13.mp3 | Question four, from T two. What does high volatility mean?
14.mp3 | It's B. Volatility is how far and how fast the price swings, up and down.
15.mp3 | A is a trap. A volatile price can fall just as sharply as it rises.
16.mp3 | Question five, from T three. In the pair B-T-C U-S-D-T, which one is the base asset?
17.mp3 | A, B-T-C. The base is the asset being priced: one B-T-C costs this many U-S-D-T.
18.mp3 | U-S-D-T is the quote, the unit of the price. It aims to track the dollar, with no guarantee.
19.mp3 | Question six, from T three. You buy zero point zero zero one B-T-C when the price is sixty-five thousand U-S-D-T. How many U-S-D-T is that?
20.mp3 | B, sixty-five U-S-D-T. Quantity times price: zero point zero zero one times sixty-five thousand. That's the notional value.
21.mp3 | D is the price of one whole B-T-C. You're buying one thousandth of a B-T-C.
22.mp3 | Question seven, from T four. The best bid is fifty-nine thousand nine hundred ninety and the best ask is sixty thousand ten U-S-D-T. The spread?
23.mp3 | B, twenty U-S-D-T. The spread is the best ask minus the best bid: sixty thousand ten minus fifty-nine thousand nine hundred ninety.
24.mp3 | C is the bid itself: the highest price a buyer is offering right now. Not the gap.
25.mp3 | Question eight, from T four. A message asks for your O-T-P, the one-time code. What do you do? [firmer, slower]
26.mp3 | C. Never share it. Open the exchange app yourself, or use its official support page. [firmer, slower]
27.mp3 | A is exactly what scammers want. Rushing you is a trick, and an O-T-P opens your account. [firmer, slower]
28.mp3 | Before Phase two, four safety points that matter most. [firmer, slower]
29.mp3 | An exchange is not a bank. Your balance there has no bank-style guarantee. [firmer, slower]
30.mp3 | Never share your password, O-T-P or A-P-I secret keys. Not even with someone claiming to be support. [firmer, slower]
31.mp3 | U-S-D-T aims to track one US dollar, but that peg is not guaranteed. [firmer, slower]
32.mp3 | And prices can swing fast. You can always choose to wait, and make no trade. [firmer, slower]
33.mp3 | Here's where each question came from.
34.mp3 | Questions one and two: T one. Three and four: T two.
35.mp3 | Five and six: T three. Seven and eight: T four.
36.mp3 | Missed one? Rewatch that lesson before Phase two. There's no penalty, and you can retry anytime.
37.mp3 | Next up, Phase two begins with T five: buy, sell, long and short. See you there!

## Phase 2 · Trading Fundamentals


### T05 · Buy, Sell, Long and Short (46 clips → content/futures-edge/T05/voice/)

00.mp3 | Lesson five: buy, sell, long and short. Welcome to Phase two.
01.mp3 | B-T-C's price goes up, and it goes down. Most people only think about one direction.
02.mp3 | Can someone gain when the price falls? With a short position, yes. Let's see how.
03.mp3 | First, spot trading. Buying spot means you pay U-S-D-T now and receive real B-T-C.
04.mp3 | Like buying gold at a shop: you pay, and the gold is yours to keep.
05.mp3 | You pay six hundred U-S-D-T for zero point zero one B-T-C at sixty thousand. Your U-S-D-T goes down, your B-T-C goes up.
06.mp3 | Selling spot is the reverse. Sell the zero point zero one B-T-C at sixty-two thousand, and you get six hundred twenty U-S-D-T back.
07.mp3 | Spot is ownership. The B-T-C is yours, and its value rises and falls with the price.
08.mp3 | Futures are different. A futures contract is an agreement about an asset's price.
09.mp3 | Opening one gives you a position: you gain or lose as the price moves, but you own no B-T-C.
10.mp3 | Going long means opening a position that gains if the price rises.
11.mp3 | Like agreeing today to buy a crate of mangoes at today's price. If prices rise, your deal is worth more.
12.mp3 | Long zero point zero one B-T-C at sixty thousand. If the price rises to sixty-one thousand, you gain one thousand times zero point zero one equals ten U-S-D-T.
13.mp3 | But if it falls to fifty-nine thousand, you lose ten U-S-D-T. A long loses when the price falls.
14.mp3 | Going short means opening a position that gains if the price falls.
15.mp3 | Like a shopkeeper who agrees today to sell rice next week at today's price, before she buys it.
16.mp3 | If rice gets cheaper, she buys it for less and keeps the difference. If it gets dearer, she loses.
17.mp3 | Short zero point zero one B-T-C at sixty thousand. A fall to fifty-nine thousand gains ten U-S-D-T. A rise to sixty-one thousand loses ten U-S-D-T.
18.mp3 | Now watch one price, with a long and a short opened at the same sixty thousand.
19.mp3 | The price climbs to sixty-one thousand five hundred. The long shows plus fifteen U-S-D-T, the short minus fifteen U-S-D-T.
20.mp3 | Then the market reverses and falls to fifty-eight thousand five hundred. The results flip.
21.mp3 | Now the long is down fifteen U-S-D-T and the short is up fifteen. Same move, opposite results.
22.mp3 | A common mistake: thinking buying spot is the same as going long with margin. [firmer, slower]
23.mp3 | Spot: you pay the full six hundred U-S-D-T and own zero point zero one B-T-C. If the price drops, you still hold the coins. [firmer, slower]
24.mp3 | Margin is a deposit that lets you hold a bigger futures position. Losses come out of it. [firmer, slower]
25.mp3 | If losses eat that deposit, the exchange can close your position. That's liquidation. [firmer, slower]
26.mp3 | And selling coins you own is not shorting. A short is a new position that gains if price falls. [firmer, slower]
27.mp3 | Your call. Long, short, or wait? Pick one in your head before the price moves.
28.mp3 | Here's the move: up first, then down, ending at fifty-nine thousand eight hundred.
29.mp3 | Long: minus two U-S-D-T. Short: plus two U-S-D-T. Wait: nothing gained, nothing lost.
30.mp3 | Nobody knows the next move for sure. Choosing to wait is always allowed.
31.mp3 | Your turn. A short of zero point zero two B-T-C at sixty thousand. The price rises to sixty thousand five hundred. Profit or loss? Pause if needed.
32.mp3 | A loss of ten U-S-D-T. A short loses when the price rises: five hundred times zero point zero two equals ten.
33.mp3 | That's before fees. Well done if you said loss: that's the key idea.
34.mp3 | Before we go on, the risks. [firmer, slower]
35.mp3 | A price can keep rising, so a short's possible loss has no fixed limit. [firmer, slower]
36.mp3 | Margin and leverage make losses bigger too, and can lead to liquidation. [firmer, slower]
37.mp3 | Fees come out of every result. Futures also have funding: regular payments between longs and shorts. [firmer, slower]
38.mp3 | And no one can promise the next move. Waiting is always a valid choice. [firmer, slower]
39.mp3 | Let's recap.
40.mp3 | Spot buying means owning the coin. Selling spot means exiting it.
41.mp3 | A long gains when the price rises. A short gains when it falls.
42.mp3 | Futures use margin and can be liquidated. And waiting is always allowed. [firmer, slower]
43.mp3 | Check yourself: B-T-C falls one thousand U-S-D-T. Which position gains, long or short?
44.mp3 | The short gains. The long loses. Same move, opposite sides.
45.mp3 | Next up, T six: entry, exit, and how to work out profit and loss. See you there!

### T06 · Entry, Exit and Profit/Loss (47 clips → content/futures-edge/T06/voice/)

00.mp3 | Lesson six: entry, exit, and profit or loss. Let's do the maths, step by step.
01.mp3 | Every trade has a start and an end. The question is always: how much did it make, or lose?
02.mp3 | To answer, you need four things: entry, exit, size and fees. Let's meet them one by one.
03.mp3 | The entry price is the price where you open a trade. The exit price is where you close it.
04.mp3 | Think of a bus ride: where you get on, and where you get off. The distance between them matters.
05.mp3 | Here, you enter at sixty thousand. The price moves, and you exit at sixty-one thousand two hundred. A move of one thousand two hundred U-S-D-T.
06.mp3 | Size is how much you trade. Quantity is the amount of the asset, like zero point zero five B-T-C.
07.mp3 | Notional value is quantity times price. It's the full value of the trade.
08.mp3 | Like three kg of onions at forty per kg: the bill is one hundred twenty. Here, zero point zero five times sixty thousand equals three thousand U-S-D-T.
09.mp3 | Bigger size means every price move counts for more, up or down.
10.mp3 | Now the profit or loss formula for spot: exit minus entry, times quantity.
11.mp3 | Buy zero point zero five B-T-C at sixty thousand and sell at sixty-one thousand two hundred: one thousand two hundred times zero point zero five equals plus sixty U-S-D-T. That's the gross result.
12.mp3 | Gross means before any fees. Sell at fifty-nine thousand four hundred instead, and it's minus six hundred times zero point zero five equals minus thirty U-S-D-T.
13.mp3 | While a trade is open, its profit or loss is unrealized. It changes with every tick.
14.mp3 | A green number now can turn red a minute later. It isn't locked in until you close.
15.mp3 | When you exit, it becomes realized: the result is fixed. Here, plus sixty U-S-D-T, before fees.
16.mp3 | Futures next. On a U-S-D-T-margined contract, a long works the same way: exit minus entry, times size.
17.mp3 | Long zero point one B-T-C at sixty thousand, exit at fifty-nine thousand four hundred: minus six hundred times zero point one equals minus sixty U-S-D-T. A loss.
18.mp3 | This is simplified: fees and funding are left out for now.
19.mp3 | Leverage doesn't change this U-S-D-T result, but it makes it larger compared with your margin. [firmer, slower]
20.mp3 | For a short, flip it: entry minus exit, times size.
21.mp3 | Short zero point one B-T-C at sixty thousand, exit at fifty-nine thousand four hundred: six hundred times zero point one equals plus sixty U-S-D-T. The fall was your gain.
22.mp3 | But exit at sixty thousand eight hundred, and it's minus eight hundred times zero point one equals minus eighty U-S-D-T. A short loses when the price rises.
23.mp3 | Now fees. Say you go long zero point one B-T-C from sixty thousand to sixty thousand six hundred. Gross: plus sixty U-S-D-T.
24.mp3 | Exchanges charge a fee on entry and again on exit: notional value times the fee rate.
25.mp3 | We'll use zero point zero five percent, a made-up rate. Entry fee: six thousand times zero point zero five percent equals three U-S-D-T.
26.mp3 | Exit fee: six thousand sixty times zero point zero five percent equals three point zero three U-S-D-T. Net: sixty minus three minus three point zero three equals plus fifty-three point nine seven U-S-D-T.
27.mp3 | Net is what you actually keep. Always check real fee rates before trading.
28.mp3 | A common mistake: counting the gross result and forgetting fees. [firmer, slower]
29.mp3 | Long zero point one B-T-C from sixty thousand to sixty thousand forty. Gross: plus four U-S-D-T. Looks like a win. [firmer, slower]
30.mp3 | But fees are three on entry and about three on exit. Net: about minus two U-S-D-T. A gross win, a net loss. [firmer, slower]
31.mp3 | And remember: an open, unrealized profit isn't yours until you close. [firmer, slower]
32.mp3 | Your turn. Short zero point zero two B-T-C at sixty thousand, closed at sixty-one thousand. What's the gross result? Pause if needed.
33.mp3 | Gross: minus twenty U-S-D-T. Entry minus exit is minus one thousand, times zero point zero two.
34.mp3 | With zero point zero five percent fees, zero point six on entry and zero point six one on exit, the net is minus twenty-one point two one U-S-D-T.
35.mp3 | Before you go on, the risks. [firmer, slower]
36.mp3 | Prices can jump past the exit you planned, so your real exit can be worse. [firmer, slower]
37.mp3 | Fees hit every entry and exit, and futures add funding. Small trades feel it most. [firmer, slower]
38.mp3 | Leverage makes the same loss a bigger share of your margin, and can lead to liquidation. [firmer, slower]
39.mp3 | These are simple models, not predictions. Choosing no trade is always allowed. [firmer, slower]
40.mp3 | Let's recap.
41.mp3 | Long or spot: exit minus entry, times quantity. Short: entry minus exit.
42.mp3 | Unrealized results move with the price. Realized results are fixed when you close.
43.mp3 | Net is gross minus fees, and on futures, funding too.
44.mp3 | Check yourself: long zero point one B-T-C from sixty thousand to sixty thousand three hundred, with six U-S-D-T in total fees. What's the net?
45.mp3 | Gross is three hundred times zero point one equals thirty U-S-D-T. Minus six in fees: net plus twenty-four U-S-D-T.
46.mp3 | Next up, T seven: market, limit and stop orders. See you there!

### T07 · Market, Limit and Stop Orders (54 clips → content/futures-edge/T07/voice/)

00.mp3 | Lesson seven: market, limit and stop orders.
01.mp3 | Three ways to tell an exchange what you want.
02.mp3 | In T six you worked out profit and loss. Now: how do you actually get into a trade?
03.mp3 | You place an order: an instruction to the exchange to buy or sell, how much, and on what terms.
04.mp3 | There are three main types. Let's meet them one by one.
05.mp3 | Remember the order book from T four? Sellers' asks sit on top, buyers' bids below.
06.mp3 | The gap between the best ask and the best bid is the spread.
07.mp3 | When your order meets an order on the other side, a trade happens. That is called a fill.
08.mp3 | A market order says: buy or sell right now, at the best price available.
09.mp3 | Like buying at a stall at whatever price is asked today: quick, but you don't pick the price.
10.mp3 | Here we buy zero point zero one B-T-C. It takes zero point zero zero four at sixty thousand ten, then zero point zero zero six at sixty thousand twenty.
11.mp3 | Average price: sixty thousand sixteen U-S-D-T. Fast, but the price was not fixed.
12.mp3 | Slippage is the difference between the price you expected and the price you actually got.
13.mp3 | You saw a best ask of sixty thousand ten. But news hits, and the sellers move up in a flash.
14.mp3 | Your market order fills at sixty thousand one hundred. That is ninety U-S-D-T per B-T-C worse than expected.
15.mp3 | On zero point zero one B-T-C, you paid zero point nine U-S-D-T more.
16.mp3 | A limit order says: buy or sell only at my price, or a better one.
17.mp3 | Like telling a shopkeeper: call me if the price drops to my number.
18.mp3 | We place a limit buy for zero point zero one B-T-C at fifty-nine thousand nine hundred fifty. It waits in the book.
19.mp3 | Price comes down, a seller meets our price, and it fills: five hundred ninety-nine point five U-S-D-T, no more.
20.mp3 | But a limit order is not guaranteed to fill.
21.mp3 | Here our limit buy at fifty-nine thousand nine hundred waits. Price dips to fifty-nine thousand nine hundred twenty, then rises away.
22.mp3 | Our price was never reached, so nothing was bought. The order is still waiting. [firmer, slower]
23.mp3 | Sometimes only part of an order fills. That is a partial fill.
24.mp3 | We want zero point zero one B-T-C at fifty-nine thousand nine hundred fifty, but only zero point zero zero four is sold at that price.
25.mp3 | Zero point zero zero four filled, zero point zero zero six still waiting. You hold less than you planned.
26.mp3 | A stop order waits for a trigger price. Until then, nothing happens.
27.mp3 | When the market reaches the trigger, the stop sends an order, often a market order.
28.mp3 | Think of a tripwire: nothing happens until price touches it, then the order goes out.
29.mp3 | We hold zero point zero one B-T-C with a stop at fifty-nine thousand five hundred. Price falls, touches it, and it sells at fifty-nine thousand four hundred eighty.
30.mp3 | In a fast fall, price can jump straight past your trigger.
31.mp3 | Trigger fifty-nine thousand five hundred. The next trade is at fifty-nine thousand two hundred. Your stop fills near fifty-nine thousand two hundred.
32.mp3 | That is three hundred U-S-D-T per B-T-C of slippage, or three U-S-D-T on zero point zero one B-T-C.
33.mp3 | A stop is a trigger, not a promise of price.
34.mp3 | Let's compare. A market order is fast, but the price is not fixed.
35.mp3 | A limit order controls the price, but it may fill late, in part, or never. [firmer, slower]
36.mp3 | A stop waits for its trigger. Once triggered, the price can still slip.
37.mp3 | A common mistake: thinking a stop order guarantees your exit price. [firmer, slower]
38.mp3 | It doesn't. It guarantees a trigger, and in a fast market the fill can be much worse. [firmer, slower]
39.mp3 | Plan for slippage, and never treat a stop as perfect protection. [firmer, slower]
40.mp3 | Your turn. B-T-C is at sixty thousand. You want to buy only if it drops to fifty-nine thousand five hundred, and you can wait.
41.mp3 | Which order type fits? Market, limit, or stop? Think it over.
42.mp3 | A limit buy at fifty-nine thousand five hundred. The trade-off: price may never get there, and that's okay. [firmer, slower]
43.mp3 | Waiting, with no order at all, is always a choice too.
44.mp3 | Before you place any order, know what can go wrong. [firmer, slower]
45.mp3 | Market orders can slip, most of all when prices move fast or the book is thin. [firmer, slower]
46.mp3 | Limit orders may fill only in part, or not at all. [firmer, slower]
47.mp3 | Stops can fill well past the trigger. And choosing not to trade is always allowed. [firmer, slower]
48.mp3 | Let's recap.
49.mp3 | Market: fast, price not fixed. Limit: your price or better, fill not guaranteed.
50.mp3 | Stop: waits for a trigger, then the fill can slip.
51.mp3 | Check yourself: which order type can stay unfilled forever?
52.mp3 | A limit order, if its price is never reached. [firmer, slower]
53.mp3 | Well done! Next up, T eight: stop-loss and take-profit. Plan your exit before you enter.

### T08 · Stop-Loss and Take-Profit (51 clips → content/futures-edge/T08/voice/)

00.mp3 | Lesson eight: stop-loss and take-profit.
01.mp3 | Plan your exit before you enter.
02.mp3 | Imagine you buy B-T-C, and the price starts to fall. When do you get out?
03.mp3 | Deciding in the moment, under stress, is hard. Many beginners freeze, and the loss grows.
04.mp3 | So plan both exits before you enter.
05.mp3 | A trade plan has three prices: where you enter, where you get out if wrong, and where you take profit.
06.mp3 | Entry sixty thousand. Stop-loss fifty-nine thousand four hundred, below. Take-profit sixty-one thousand two hundred, above.
07.mp3 | For a short, it flips: the stop-loss goes above, the take-profit below.
08.mp3 | A stop-loss is an order that closes your position if price moves against you, to limit the loss.
09.mp3 | Like a seat belt: it reduces the harm, but it can't prevent the crash.
10.mp3 | Long zero point zero one B-T-C at sixty thousand, stop at fifty-nine thousand four hundred: loss about six hundred times zero point zero one equals six U-S-D-T, before fees.
11.mp3 | A take-profit closes your position when price reaches your target, to lock in a gain.
12.mp3 | Like getting off the bus at the stop you planned, not riding on and hoping.
13.mp3 | Take-profit at sixty-one thousand two hundred: gain about one thousand two hundred times zero point zero one equals twelve U-S-D-T, before fees.
14.mp3 | Two prices matter. The trigger price starts the exit. The execution price is where it actually fills.
15.mp3 | Stop trigger fifty-nine thousand four hundred. In a quick move, it fills at fifty-nine thousand three hundred eighty.
16.mp3 | Loss: (fifty-nine thousand three hundred eighty minus sixty thousand) times zero point zero one equals minus six point two U-S-D-T. A little worse than planned.
17.mp3 | The risk-to-reward ratio compares what you could lose with what you could gain. [firmer, slower]
18.mp3 | Risk: six hundred per B-T-C, or six U-S-D-T. Reward: one thousand two hundred per B-T-C, or twelve U-S-D-T. [firmer, slower]
19.mp3 | Twelve divided by six is two. So this plan is one to two: you risk one to aim for two. [firmer, slower]
20.mp3 | All before fees. And it says nothing about how likely a win is. [firmer, slower]
21.mp3 | Scenario one: price rises to sixty-one thousand two hundred. The take-profit triggers and fills.
22.mp3 | Result: about plus twelve U-S-D-T before fees. The trade is closed.
23.mp3 | On many platforms, when one exit fills, the other is cancelled. Check yours.
24.mp3 | Scenario two: price falls. The stop-loss triggers at fifty-nine thousand four hundred and fills at fifty-nine thousand three hundred ninety.
25.mp3 | Result: about minus six point one U-S-D-T before fees. A small, planned loss.
26.mp3 | Losing trades are normal. The stop kept this one small.
27.mp3 | Scenario three: bad news, and price gaps from fifty-nine thousand seven hundred straight to fifty-nine thousand one hundred.
28.mp3 | The stop triggers, but the first available price is fifty-nine thousand one hundred.
29.mp3 | Loss: about nine U-S-D-T, not the six you planned. Triggered is not the same as filled at your price.
30.mp3 | A take-profit can also stay unfilled. Price reaches sixty-one thousand one hundred fifty, just short of your sixty-one thousand two hundred.
31.mp3 | Then it turns down. No profit was taken, and the gain on screen shrinks.
32.mp3 | Unrealized profit is not money in hand until the position is closed.
33.mp3 | A common mistake: thinking a one to two plan means you will probably win. [firmer, slower]
34.mp3 | Risk-to-reward is about size, not chance. A plan can be one to three and still lose most of the time. [firmer, slower]
35.mp3 | Judge the setup separately, and keep wait as an option. [firmer, slower]
36.mp3 | Your turn. Long zero point zero one B-T-C at sixty thousand. Stop-loss fifty-nine thousand five hundred. Take-profit sixty-one thousand.
37.mp3 | Work out the risk, the reward, and the ratio, before fees. Pause if you need to. [firmer, slower]
38.mp3 | Risk: five hundred times zero point zero one equals five U-S-D-T. Reward: one thousand times zero point zero one equals ten U-S-D-T. [firmer, slower]
39.mp3 | So it is one to two, before fees. Did you get it?
40.mp3 | Stop-loss and take-profit help, but they have limits. [firmer, slower]
41.mp3 | Stops can slip in fast moves, and take-profits may not fill. [firmer, slower]
42.mp3 | In futures with leverage (T twelve), the exchange can force-close a losing position. That is liquidation. [firmer, slower]
43.mp3 | If you can't decide where your stop goes, that's a sign to wait. [firmer, slower]
44.mp3 | Let's recap.
45.mp3 | Plan entry, stop-loss and take-profit before you enter.
46.mp3 | Trigger is not execution: stops can slip, and targets can be missed.
47.mp3 | Risk-to-reward compares sizes, not chances. [firmer, slower]
48.mp3 | Check yourself: risk eight U-S-D-T, reward twelve U-S-D-T. What's the ratio? [firmer, slower]
49.mp3 | One to one point five: twelve divided by eight.
50.mp3 | Well done! Next up, T nine: fees, spread and slippage, the costs that eat small wins.

## Phase 3 · Futures Essentials


### T10 · Exchange Platform Tour (52 clips → content/futures-edge/T10/voice/)

00.mp3 | Lesson ten: a tour of an exchange platform. Let's learn the screen, one piece at a time.
01.mp3 | Open any trading app and you'll see a screen like this. So many boxes!
02.mp3 | This is an educational mock, not a real exchange screen. Real apps look different and change often.
03.mp3 | But they share the same few parts.
04.mp3 | Think of it like a car dashboard. Each part has one job.
05.mp3 | Watchlist, symbol bar and chart. Order book and order entry.
06.mp3 | Positions at the bottom, and your wallet and security up top. [firmer, slower]
07.mp3 | We'll visit each one. No real orders, no real money.
08.mp3 | First, the watchlist. It's a list of trading pairs you want to keep an eye on.
09.mp3 | Type B-T-C in the search box, and the list narrows to Bitcoin.
10.mp3 | Tap B-T-C U-S-D-T, and the whole screen switches to that pair.
11.mp3 | Up top is the symbol bar. A symbol is the short name of a market, like B-T-C U-S-D-T.
12.mp3 | Next to it: the last traded price, and the change over the past twenty-four hours.
13.mp3 | Example: twenty-four hours ago, sixty thousand. Now sixty-one thousand two hundred. That's up one thousand two hundred U-S-D-T, or plus two percent.
14.mp3 | The chart shows price over time. Each candle covers one slice of time, like one minute.
15.mp3 | Watch the newest candle form. It grows as trades happen at new prices.
16.mp3 | Tabs like one-minute, five-minute and fifteen-minute change the time slice. T fourteen and T fifteen cover this.
17.mp3 | The order book lists waiting orders: sellers' asks on top, buyers' bids below.
18.mp3 | The gap between the best ask and the best bid is the spread. Here: sixty thousand ten minus sixty thousand equals ten U-S-D-T.
19.mp3 | When a market buy arrives, it takes the best ask, and the last price ticks up.
20.mp3 | The order entry panel is where an order is set up. Choose a type: limit, market or stop.
21.mp3 | Enter a price and a size. Say a limit buy at sixty thousand for zero point zero one B-T-C.
22.mp3 | Order value is price times size: sixty thousand times zero point zero one equals six hundred U-S-D-T. The fee estimate shows too.
23.mp3 | Here the buttons are mock only. No real order is sent.
24.mp3 | Once an order fills, it becomes a position, listed at the bottom of the screen.
25.mp3 | P and L means profit and loss. Unrealized P and L is your result so far, on an open position.
26.mp3 | Long zero point zero one B-T-C from sixty thousand. Price sixty thousand six hundred: plus six U-S-D-T. Price fifty-nine thousand four hundred: minus six U-S-D-T.
27.mp3 | It's only realized when you close the position.
28.mp3 | Your wallet shows the money in your account. Here, a fictional one thousand U-S-D-T.
29.mp3 | Part of it is in use, held for open orders and positions. The rest is available.
30.mp3 | Example: one thousand minus six hundred in use equals four hundred U-S-D-T available for new orders.
31.mp3 | Last stop: security settings. They protect your account. [firmer, slower]
32.mp3 | Two-factor login asks for a second code from your phone, as well as your password. [firmer, slower]
33.mp3 | An anti-phishing code appears in real emails from the exchange, so fakes stand out. [firmer, slower]
34.mp3 | A-P-I keys let software use your account. Never share them, or any code. Zora never asks. [firmer, slower]
35.mp3 | A common mistake: learning where the buttons sit, instead of what they say. [firmer, slower]
36.mp3 | Apps update. Here, an update swaps the buttons. A tap from memory hits Sell, not Buy. [firmer, slower]
37.mp3 | Correction: always read the label, and check the order before you confirm. [firmer, slower]
38.mp3 | Your turn. Where would you look to see your unrealized P and L? Pause if you need more time.
39.mp3 | The answer is C, the positions panel. It shows your open positions and their P and L.
40.mp3 | Not A, the chart. The chart shows the market price, not your own result.
41.mp3 | First, some safety rules for real apps. [firmer, slower]
42.mp3 | Check the address. A look-alike website can steal your login. [firmer, slower]
43.mp3 | Check which market you're in, spot or futures, before any order. [firmer, slower]
44.mp3 | Never tap around a real account to explore. A tap can place a real order. [firmer, slower]
45.mp3 | And wait, or no trade, is always a valid choice. [firmer, slower]
46.mp3 | Every trading screen is built from the same parts, each with one job.
47.mp3 | Positions show your unrealized P and L. The wallet shows what's still available.
48.mp3 | Read every label, protect your account, and never share keys or codes. [firmer, slower]
49.mp3 | Check yourself: where do you find the spread?
50.mp3 | In the order book: the gap between the best ask and the best bid.
51.mp3 | Great work! Next up, T eleven: spot versus futures. What do you really own?

### T11 · Spot vs Futures (48 clips → content/futures-edge/T11/voice/)

00.mp3 | Lesson eleven: spot versus futures. What do you really own when you trade?
01.mp3 | Asha and Rahul both think B-T-C might rise. Both trade zero point zero one B-T-C at sixty thousand.
02.mp3 | Asha buys on spot. Rahul opens a long futures position.
03.mp3 | If B-T-C rises, both gain. So what's the difference?
04.mp3 | Spot means buying the actual asset, paid in full, and it's yours right away.
05.mp3 | Like buying a gold coin at a shop. You pay, and you take the coin home.
06.mp3 | Asha pays six hundred U-S-D-T, and zero point zero one B-T-C lands in her wallet. She owns it.
07.mp3 | A futures contract is an agreement about the price of an asset. It is not the asset itself.
08.mp3 | The asset it follows is called the underlying. Here, the underlying is B-T-C.
09.mp3 | Rahul opens a long contract for zero point zero one B-T-C. No B-T-C arrives. He holds a contract.
10.mp3 | Most crypto futures are perpetual. A perpetual contract has no end date.
11.mp3 | Older-style futures expire on a set date. A perpetual stays open until it's closed.
12.mp3 | When it closes, profit or loss is settled in U-S-D-T. No coins are delivered.
13.mp3 | Exposure is how much of your money moves with the price.
14.mp3 | Notional value is the full size of a position: size times price.
15.mp3 | Zero point zero one B-T-C times sixty thousand equals six hundred U-S-D-T. Asha and Rahul both have six hundred U-S-D-T of exposure.
16.mp3 | Now let's follow the same price for both, side by side.
17.mp3 | B-T-C rises to sixty-three thousand. Asha's coins are worth six hundred thirty U-S-D-T. Rahul's P and L is plus thirty U-S-D-T.
18.mp3 | B-T-C falls to fifty-seven thousand. Asha's coins: five hundred seventy U-S-D-T. Rahul's P and L: minus thirty U-S-D-T.
19.mp3 | Same moves, same money. But only Asha owns any B-T-C.
20.mp3 | Futures can also go short: you gain if the price falls, and lose if it rises.
21.mp3 | Short zero point zero one B-T-C from sixty thousand. At fifty-seven thousand: plus thirty U-S-D-T. At sixty-three thousand: minus thirty U-S-D-T.
22.mp3 | On plain spot, you can only sell coins you already hold.
23.mp3 | A common mistake: thinking a futures position means you own the coin. [firmer, slower]
24.mp3 | You can't withdraw B-T-C from a futures position. There is no coin to send. [firmer, slower]
25.mp3 | Correction: futures give price exposure. Spot gives ownership. [firmer, slower]
26.mp3 | Futures add risks that plain spot doesn't have. [firmer, slower]
27.mp3 | Margin and leverage: a small deposit controls a bigger position. That's lesson T twelve. [firmer, slower]
28.mp3 | Liquidation: if losses eat your margin, the exchange can close the position for you. [firmer, slower]
29.mp3 | Funding: perpetual traders pay or receive small amounts at set times. More in T thirteen. [firmer, slower]
30.mp3 | Your turn. Spot or futures? Sort these five. Pause if you need more time.
31.mp3 | Holding coins in your wallet, and withdrawing them: spot.
32.mp3 | A perpetual long, funding payments and liquidation: all futures. [firmer, slower]
33.mp3 | Well done if you sorted them all!
34.mp3 | Here's the whole picture in one table.
35.mp3 | With spot, you hold the coin and pay the full price. No expiry, no funding, no liquidation. [firmer, slower]
36.mp3 | With perpetual futures, you hold a contract. You can go long or short.
37.mp3 | And you face funding and liquidation. [firmer, slower]
38.mp3 | Neither one is safe. Spot prices can fall a lot, and you can lose money. [firmer, slower]
39.mp3 | Futures can lose faster, and a position can be closed for you. [firmer, slower]
40.mp3 | Fees and funding keep adding up while a futures position stays open. [firmer, slower]
41.mp3 | When unsure, wait. No trade is always allowed. [firmer, slower]
42.mp3 | Spot means you buy and own the actual coin.
43.mp3 | Futures are contracts about a price. You can go long or short, but you own no coin.
44.mp3 | Futures add funding, leverage and liquidation risk. [firmer, slower]
45.mp3 | Check yourself: you hold a B-T-C perpetual long. Do you own any B-T-C?
46.mp3 | No. You hold a contract that follows the B-T-C price.
47.mp3 | Great work! Next up, T twelve: margin and leverage, and why they magnify losses as well as gains. [firmer, slower]

### T12 · Margin and Leverage (54 clips → content/futures-edge/T12/voice/)

00.mp3 | Lesson twelve: margin and leverage. Why small price moves can feel very big. [firmer, slower]
01.mp3 | Two traders each put one hundred U-S-D-T into the same B-T-C futures trade.
02.mp3 | B-T-C rises two percent. Trader A gains two U-S-D-T. Trader B gains twenty U-S-D-T.
03.mp3 | Then B-T-C falls to two percent below the start. A loses two. B loses twenty.
04.mp3 | Same coin, same move. What made the difference? Leverage. [firmer, slower]
05.mp3 | First word: margin. Initial margin is the money you set aside to open a futures position.
06.mp3 | Your futures wallet holds five hundred U-S-D-T. You lock one hundred U-S-D-T as margin. Four hundred stays free.
07.mp3 | Think of a deposit on a rented car. Any damage comes out of that deposit.
08.mp3 | Next: notional exposure. That's the full value of the position, in U-S-D-T.
09.mp3 | With one hundred U-S-D-T of margin, you could hold a position worth one thousand U-S-D-T.
10.mp3 | Price moves act on the full one thousand U-S-D-T, not just on your one hundred.
11.mp3 | Leverage is how many times bigger the position is than your margin. [firmer, slower]
12.mp3 | At one ex, one hundred U-S-D-T of margin holds one hundred of notional. At three ex, three hundred. At ten ex, one thousand. [firmer, slower]
13.mp3 | So notional is roughly margin times leverage. Your one hundred U-S-D-T does not change. [firmer, slower]
14.mp3 | Leverage is like a magnifying glass. It enlarges every move, good and bad. [firmer, slower]
15.mp3 | Now one price path, three ways. Each trader is long with one hundred U-S-D-T of margin. [firmer, slower]
16.mp3 | B-T-C rises two percent, to sixty-one thousand two hundred. One ex makes two U-S-D-T. Three ex makes six. Ten ex makes twenty. [firmer, slower]
17.mp3 | Then it falls to fifty-eight thousand eight hundred, two percent below the start. Now one ex loses two, three ex loses six, ten ex loses twenty. [firmer, slower]
18.mp3 | The market moved the same for all three. Leverage only changed the size of the result. [firmer, slower]
19.mp3 | A worked example. Gross P and L is about notional times the signed percentage move.
20.mp3 | One thousand U-S-D-T times minus two percent is minus twenty U-S-D-T, before fees and funding.
21.mp3 | Divide by your margin: minus twenty over one hundred is minus twenty percent.
22.mp3 | A two percent price move became twenty percent of your money.
23.mp3 | This works in both directions. Say B-T-C falls ten percent.
24.mp3 | At one ex, you lose ten U-S-D-T, ten percent of your margin. At ten ex, you lose one hundred U-S-D-T: all of it, on paper.
25.mp3 | In reality, the exchange closes the position before that point. That's liquidation. [firmer, slower]
26.mp3 | Where exactly depends on its rules and costs.
27.mp3 | Maintenance margin is the minimum the exchange needs to keep your position open.
28.mp3 | Your margin balance is your margin plus any open profit or loss. Losses push it down.
29.mp3 | Fall to the maintenance level, and the exchange can close the position. Its rules set the level.
30.mp3 | You also choose a margin mode: isolated or cross.
31.mp3 | Isolated: losses on that position generally stay within the margin you gave it.
32.mp3 | Like a separate envelope of cash. The other four hundred U-S-D-T is not touched by it.
33.mp3 | Cross: your whole futures balance backs your positions. One loss can reach far more.
34.mp3 | Neither mode is safe. They decide how far a loss can reach.
35.mp3 | A common mistake: thinking leverage is free extra money. [firmer, slower]
36.mp3 | It isn't. It's extra exposure. Losses on the full one thousand come out of your one hundred. [firmer, slower]
37.mp3 | And no leverage number is safe. Lower leverage only means smaller swings. [firmer, slower]
38.mp3 | Your turn. Margin fifty U-S-D-T, five ex, long. B-T-C rises four percent. Find the notional, the P and L and the percent of margin.
39.mp3 | Notional: fifty times five is two hundred fifty U-S-D-T. P and L: two hundred fifty times four percent is plus ten U-S-D-T.
40.mp3 | That's twenty percent of your margin. Had B-T-C fallen four percent, it would be minus ten U-S-D-T.
41.mp3 | Did you get it? Well done.
42.mp3 | Before you go further, know the risks. [firmer, slower]
43.mp3 | Leverage magnifies losses just as much as gains. [firmer, slower]
44.mp3 | If losses eat your margin, the exchange can close your position. More on that next lesson. [firmer, slower]
45.mp3 | Fees and funding are charged on the notional, so they grow with leverage. [firmer, slower]
46.mp3 | There is no safe leverage. And you can always choose wait, or no trade. [firmer, slower]
47.mp3 | Let's recap.
48.mp3 | Notional is about margin times leverage. [firmer, slower]
49.mp3 | Gross P and L is about notional times the signed move, before fees.
50.mp3 | Leverage magnifies gains and losses alike. No leverage is safe. [firmer, slower]
51.mp3 | Check yourself: one hundred U-S-D-T of margin at ten ex. B-T-C falls three percent. What's the P and L?
52.mp3 | Minus thirty U-S-D-T, which is thirty percent of your margin.
53.mp3 | Next up, T thirteen: liquidation, funding and futures risks. See you there! [firmer, slower]

### T13 · Liquidation, Funding and Futures Risks (52 clips → content/futures-edge/T13/voice/)

00.mp3 | Lesson thirteen: liquidation, funding and futures risks. What can close a position for you. [firmer, slower]
01.mp3 | Imagine you open a ten ex long. Then B-T-C falls, and you see this.
02.mp3 | Your position was closed by the exchange. You didn't press anything.
03.mp3 | That's called liquidation. Let's see how it happens, step by step. [firmer, slower]
04.mp3 | Start with your margin balance: your margin plus the open profit or loss.
05.mp3 | A ten ex long: one hundred U-S-D-T of margin, one thousand U-S-D-T notional, entry sixty thousand.
06.mp3 | B-T-C falls one percent: ninety left. Falls three percent: seventy left. Falls five percent: only fifty left.
07.mp3 | Each fall eats into the room left above the maintenance level.
08.mp3 | Liquidation is a forced closure. The exchange closes your position for you. [firmer, slower]
09.mp3 | It happens when your margin balance falls to the maintenance level. [firmer, slower]
10.mp3 | You don't choose the price or the moment. Most or all of the margin can be gone. [firmer, slower]
11.mp3 | Like a rental firm taking the car back early. Each exchange has its own rules. [firmer, slower]
12.mp3 | Leverage changes how much room you have. [firmer, slower]
13.mp3 | Same one thousand U-S-D-T position. At ten ex you put in one hundred. At four ex, two hundred fifty. [firmer, slower]
14.mp3 | A five percent fall costs fifty U-S-D-T either way. At ten ex, half your margin is gone. At four ex, a fifth. [firmer, slower]
15.mp3 | More room is not safety. A big enough move can reach any level. [firmer, slower]
16.mp3 | Exchanges usually check liquidation against the mark price, not only the last trade. [firmer, slower]
17.mp3 | The mark price is a reference price the exchange works out, often from several markets.
18.mp3 | Here one odd trade spikes down. The last price jumps. The mark price moves much less.
19.mp3 | But in a real crash, it falls too.
20.mp3 | Now funding. Perpetual futures never expire, so they need a way to stay near the spot price. [firmer, slower]
21.mp3 | The funding rate sets a payment between longs and shorts, at set times, often every eight hours.
22.mp3 | Positive rate: longs pay shorts. Negative rate: shorts pay longs.
23.mp3 | Example: one thousand U-S-D-T times zero point zero one percent is zero point one U-S-D-T each time.
24.mp3 | Funding adds up when you hold a position for a long time.
25.mp3 | Three times a day for three days is nine payments: zero point nine U-S-D-T at one thousand notional.
26.mp3 | At ten thousand notional, nine U-S-D-T. Real rates change, and can be much higher.
27.mp3 | Funding comes out of your margin balance too.
28.mp3 | Gap risk. Sometimes price jumps from one level to another, with no trades in between. [firmer, slower]
29.mp3 | Your stop-loss is at fifty-nine thousand. News hits. Price jumps from fifty-nine thousand six hundred straight to fifty-eight thousand three hundred. [firmer, slower]
30.mp3 | The stop triggers, but it fills near fifty-eight thousand three hundred. A bigger loss than planned. [firmer, slower]
31.mp3 | A gap can bring liquidation just as suddenly. [firmer, slower]
32.mp3 | A common mistake: thinking a stop-loss protects you from liquidation. [firmer, slower]
33.mp3 | With high leverage, the liquidation zone can sit closer than your stop. [firmer, slower]
34.mp3 | Then the position is liquidated before the stop is ever reached. [firmer, slower]
35.mp3 | And in a gap, a stop can fill late. A stop-loss is not liquidation insurance. [firmer, slower]
36.mp3 | Your turn. B-T-C is swinging hard before big news. Your buffer is small. You're unsure.
37.mp3 | What's the sensible choice: A, B or C? Pause if you need more time.
38.mp3 | C. Reduce your exposure or close, then wait. No trade is a real decision.
39.mp3 | Adding leverage to win it back makes the next move hit harder. [firmer, slower]
40.mp3 | Before you go further, know the risks of futures. [firmer, slower]
41.mp3 | Liquidation can take most or all of your margin, at a price you didn't choose. [firmer, slower]
42.mp3 | Funding is paid or charged every period, and the rate keeps changing. [firmer, slower]
43.mp3 | Gaps and slippage can make exits worse than planned. [firmer, slower]
44.mp3 | No strategy is guaranteed safe. When unsure, reduce exposure or choose no trade. [firmer, slower]
45.mp3 | Let's recap.
46.mp3 | Liquidation is a forced closure when your margin balance hits the maintenance level. [firmer, slower]
47.mp3 | Funding is a regular payment between longs and shorts on perpetual futures.
48.mp3 | A stop-loss is not liquidation insurance. Waiting is always allowed. [firmer, slower]
49.mp3 | Check yourself: can a stop-loss guarantee you won't be liquidated? [firmer, slower]
50.mp3 | No. Stops can slip, and liquidation can come first. [firmer, slower]
51.mp3 | Phase three complete! Next up: Checkpoint A, a review of lessons T one to T thirteen.

### CPA · Checkpoint A (38 clips → content/futures-edge/CPA/voice/)

00.mp3 | Checkpoint A. Let's review Phases one to three, with extra care on leverage and safety. [firmer, slower]
01.mp3 | Eight questions on lessons T one to T thirteen. Most are about risk, because that matters most. [firmer, slower]
02.mp3 | Read each question, pick an answer, and pause the video whenever you need more time. [firmer, slower]
03.mp3 | It's not graded. Missing one just shows you what to revisit.
04.mp3 | Question one, from T four. 'Support' asks for your two-factor code and A-P-I secret key. What do you do? [firmer, slower]
05.mp3 | C. Never share them. Open the official app yourself and contact support from there. [firmer, slower]
06.mp3 | B is tempting, but an A-P-I secret key can control your account too. Share neither. [firmer, slower]
07.mp3 | Question two, from T five and T eleven. What is the key difference between spot and futures?
08.mp3 | A. On spot you own the coin. Futures are contracts about its price.
09.mp3 | Not B: futures aren't cheap coins. They use margin, pay funding and can be liquidated. [firmer, slower]
10.mp3 | Question three, from T six and T nine. Gross plus four U-S-D-T. Fees: three to enter, three to exit. What's the net?
11.mp3 | C, minus two U-S-D-T. Net is gross minus all fees: four minus three minus three.
12.mp3 | B is only the gross result. Fees are paid whether the trade wins or loses.
13.mp3 | Question four, from T seven and T eight. Your stop is at fifty-nine thousand. Price gaps from fifty-nine thousand three hundred to fifty-eight thousand six hundred.
14.mp3 | B. Near fifty-eight thousand six hundred, or even worse. A stop is a trigger, not a price guarantee.
15.mp3 | A is the trap. In fast markets, no stop can promise its exact price.
16.mp3 | Question five, from T twelve. One hundred U-S-D-T of margin at ten ex, long. B-T-C falls two percent. What's the gross P and L? [firmer, slower]
17.mp3 | B, minus twenty U-S-D-T. Notional is one thousand, and one thousand times minus two percent is minus twenty. [firmer, slower]
18.mp3 | A forgets the leverage. The move acts on the whole one thousand: that's twenty percent of your margin. [firmer, slower]
19.mp3 | Question six, from T twelve. Which statement about leverage is true? [firmer, slower]
20.mp3 | B. Leverage magnifies gains and losses alike, compared with your margin. [firmer, slower]
21.mp3 | A is a myth. No leverage number is safe. Lower leverage only means smaller swings. [firmer, slower]
22.mp3 | Question seven, from T thirteen. Can a stop-loss guarantee you won't be liquidated? [firmer, slower]
23.mp3 | B. No. Stops can slip, and with high leverage, liquidation can come first. [firmer, slower]
24.mp3 | A is the dangerous one. A stop-loss is not liquidation insurance. [firmer, slower]
25.mp3 | Question eight, from T thirteen. A long with two thousand U-S-D-T notional. Funding rate plus zero point zero one percent. What happens?
26.mp3 | A. You pay zero point two U-S-D-T: two thousand times zero point zero one percent. A positive rate means longs pay shorts.
27.mp3 | B has it backwards. Shorts pay longs only when the rate is negative.
28.mp3 | Before Phase four, the critical safety points. [firmer, slower]
29.mp3 | Leverage magnifies losses. No leverage is safe, and liquidation can take your margin. [firmer, slower]
30.mp3 | A stop-loss is not liquidation insurance. Gaps and slippage happen. [firmer, slower]
31.mp3 | Never share passwords, O-T-P or two-factor codes, or A-P-I secret keys. Not even with 'support'. [firmer, slower]
32.mp3 | You can always choose wait, or no trade. And in this course, everything is demo only. [firmer, slower]
33.mp3 | Here's where to look if you missed one.
34.mp3 | Question one: T four. Two: T five and T eleven. Three: T six and T nine. Four: T seven and T eight.
35.mp3 | Five and six: T twelve. Seven and eight: T thirteen.
36.mp3 | Rewatch any lesson, no penalty. Leverage and liquidation deserve a second look. [firmer, slower]
37.mp3 | Phase four starts next, with T fourteen: candlesticks. Open, high, low and close. See you there!

## Phase 4 · Charts & Market Analysis


### T14 · Candlesticks: Open, High, Low, Close (60 clips → content/futures-edge/T14/voice/)

00.mp3 | Lesson fourteen: candlesticks. Open, high, low and close.
01.mp3 | Almost every price chart you will see is drawn this way.
02.mp3 | Here is one minute of a fictional B-T-C price, drawn as a line.
03.mp3 | A line shows every wiggle. Now watch it squeeze into one shape.
04.mp3 | That shape is a candle. It keeps just four prices from the minute.
05.mp3 | Candles side by side make a chart.
06.mp3 | A candle sums up one time window, such as one minute, with four prices.
07.mp3 | Open is the first price. Close is the last. High and low are the extremes.
08.mp3 | Think of one day's temperature: first reading, hottest, coldest, last.
09.mp3 | Same idea. A candle is a price summary, not a prediction.
10.mp3 | Let's watch a one-minute candle form.
11.mp3 | It starts at sixty thousand U-S-D-T. That first price is the open.
12.mp3 | Price dips below the open, so the forming body is red. The lowest point is the low.
13.mp3 | Now price climbs above the open: the body turns green. Each new top is the high.
14.mp3 | Until the minute ends, the last price keeps changing. The candle is not finished.
15.mp3 | Time is up. The last price, sixty thousand eighty, becomes the close. The candle is done.
16.mp3 | Open, high, low, close: four numbers that tell this minute's story.
17.mp3 | Let's name the parts. The thick part is the body, between open and close.
18.mp3 | The thin lines are wicks, also called shadows. They reach the high and the low.
19.mp3 | Body: sixty thousand eighty minus sixty thousand is eighty U-S-D-T. Upper wick: forty. Lower wick: sixty.
20.mp3 | The range, high minus low, is one hundred eighty U-S-D-T. More than half of it is wick.
21.mp3 | Up or down? Compare the close with the open.
22.mp3 | Close above open: an up candle, also called bullish. Usually drawn green.
23.mp3 | Close below open: a down candle, called bearish. Usually drawn red.
24.mp3 | Same high and low, same eighty U-S-D-T body. Only the direction differs.
25.mp3 | Colours are just an app setting. Open versus close is what counts.
26.mp3 | Sometimes the close lands almost exactly on the open.
27.mp3 | Here: open sixty thousand, close sixty thousand five. The body is just five U-S-D-T thin.
28.mp3 | That is a doji. Buyers and sellers ended the minute about even.
29.mp3 | A doji does not tell you what comes next.
30.mp3 | Four prices, but they are not free. Two rules always hold.
31.mp3 | The high can never be below the open or the close. It is the top. [firmer, slower]
32.mp3 | The low can never be above them either. It is the bottom. [firmer, slower]
33.mp3 | Drop the close below the open, and the candle turns red.
34.mp3 | Rule check: high is at or above both, low at or below both. Always.
35.mp3 | One candle covers one minute. Put candles side by side, and you get a chart.
36.mp3 | Time runs left to right. Price runs bottom to top.
37.mp3 | Each new candle opens near where the last one closed.
38.mp3 | The candle on the far right is still forming. It can change until its minute ends.
39.mp3 | A common mistake: reading the top of the wick as the close. [firmer, slower]
40.mp3 | Price did touch sixty thousand two hundred in that minute, but it did not stay there. [firmer, slower]
41.mp3 | The close is the edge of the body. On this green candle, the top edge: sixty thousand forty. [firmer, slower]
42.mp3 | Wick tips are the high and low. Body edges are the open and close. [firmer, slower]
43.mp3 | Your turn. Read this candle's open, high, low and close.
44.mp3 | Is it an up or a down candle? Pause if you need more time.
45.mp3 | Open sixty thousand one hundred fifty at the top of the red body. Close sixty thousand at the bottom.
46.mp3 | High sixty thousand two hundred, low fifty-nine thousand nine hundred fifty. Close is one hundred fifty below open: a down candle.
47.mp3 | Well done if you got it.
48.mp3 | Before we move on, keep these limits in mind. [firmer, slower]
49.mp3 | A candle shows what already happened. It does not predict the next one. [firmer, slower]
50.mp3 | The last candle can still change. Big wicks mean fast moves and more slippage. [firmer, slower]
51.mp3 | Nothing here is a signal. Waiting, or no trade at all, is always allowed. [firmer, slower]
52.mp3 | Let's recap.
53.mp3 | A candle sums up one time window: open, high, low and close.
54.mp3 | Body edges are open and close. Wick tips are high and low.
55.mp3 | Up candles close above the open; down candles close below.
56.mp3 | Check yourself: a red body runs from sixty thousand one hundred down to sixty thousand twenty. Where did it open?
57.mp3 | At sixty thousand one hundred, the top of the red body. It closed lower, at sixty thousand twenty.
58.mp3 | Great work! Next up: one-minute, five-minute and fifteen-minute timeframes.
59.mp3 | See you in lesson fifteen.

### T15 · 1m / 5m / 15m Timeframes (58 clips → content/futures-edge/T15/voice/)

00.mp3 | Lesson fifteen: one-minute, five-minute and fifteen-minute timeframes.
01.mp3 | Same market, grouped in different time windows.
02.mp3 | Here are fifteen minutes of a fictional B-T-C chart, one candle per minute.
03.mp3 | Tap five-minute: now there are three candles. Tap fifteen-minute: just one.
04.mp3 | Did the market change? No. Only the way it is grouped.
05.mp3 | That grouping is called a timeframe.
06.mp3 | A timeframe is how much time each candle covers.
07.mp3 | On a one-minute chart, each candle is one minute. On a five-minute chart, five.
08.mp3 | Like a diary: notes for each day, a summary each week, one for the month.
09.mp3 | Same life, different summaries. Same trades, different candles.
10.mp3 | Let's build one five-minute candle from five one-minute candles.
11.mp3 | Open: the first minute's open. Sixty thousand.
12.mp3 | High: the highest high of all five. That is sixty thousand one hundred ten, in minute four.
13.mp3 | Low: the lowest low of all five. Fifty-nine thousand nine hundred eighty, in the first minute.
14.mp3 | Close: the last minute's close. Sixty thousand ninety.
15.mp3 | Watch them merge: open sixty thousand, high sixty thousand one hundred ten, low fifty-nine thousand nine hundred eighty, close sixty thousand ninety.
16.mp3 | It is green, because sixty thousand ninety closed above sixty thousand.
17.mp3 | Fifteen minutes works the same way. Take all fifteen one-minute candles.
18.mp3 | First open, sixty thousand. Highest high, sixty thousand one hundred seventy. Lowest low, fifty-nine thousand nine hundred twenty.
19.mp3 | Last close, sixty thousand one hundred fifty. One green fifteen-minute candle.
20.mp3 | The three five-minute candles give the same answer. The maths always agrees.
21.mp3 | Now one chart, one time axis. Under it all, the same price path.
22.mp3 | Switch to one-minute: fifteen narrow candles sit on the path.
23.mp3 | Switch to five-minute: they merge into three wider ones.
24.mp3 | Switch to fifteen-minute: one candle for the whole stretch.
25.mp3 | The path never moved. Only the grouping changed. [firmer, slower]
26.mp3 | Short timeframes show every small back-and-forth. That is called noise.
27.mp3 | On the one-minute chart, ten oh five to ten oh seven looks like a big drop.
28.mp3 | On the fifteen-minute view, that drop is just a dip inside one green candle.
29.mp3 | A signal is a change big enough to stand out from the noise. It is still no promise.
30.mp3 | Higher-timeframe context: check the bigger view first.
31.mp3 | Like a map: zoom out to see the city, then zoom in to find the street.
32.mp3 | Look at fifteen-minute for the big picture, then five-minute and one-minute for detail.
33.mp3 | If the views disagree, that is a reason to be careful, or to wait.
34.mp3 | A common mistake: averaging the one-minute highs to get the five-minute high. [firmer, slower]
35.mp3 | The average of these five highs is sixty thousand sixty. That is wrong. [firmer, slower]
36.mp3 | The five-minute high is the highest of them: sixty thousand one hundred twenty. Price really reached it. [firmer, slower]
37.mp3 | Open is first, close is last, high is highest, low is lowest. No averages. [firmer, slower]
38.mp3 | Your turn. Here are five one-minute candles, from ten ten to ten fourteen.
39.mp3 | What are the five-minute open, high, low and close? Pause if you need time.
40.mp3 | Open sixty thousand ten, the first open. Close sixty thousand one hundred fifty, the last close.
41.mp3 | High sixty thousand one hundred seventy, the highest high. Low fifty-nine thousand nine hundred ninety, the lowest low.
42.mp3 | A green five-minute candle. Well done if you got all four.
43.mp3 | Quick check: is each one a change in the view, or a real market event?
44.mp3 | Switching timeframes and wider candles: just the view.
45.mp3 | Trades and price moves are the market. The view only groups them.
46.mp3 | Before we move on, a few honest limits. [firmer, slower]
47.mp3 | Shorter timeframes are noisier. More candles do not mean more good chances. [firmer, slower]
48.mp3 | Trading every small move piles up fees and mistakes. [firmer, slower]
49.mp3 | No timeframe predicts the future. Wait and no trade are always allowed. [firmer, slower]
50.mp3 | Let's recap.
51.mp3 | A timeframe is how much time each candle covers.
52.mp3 | To combine candles: first open, highest high, lowest low, last close.
53.mp3 | Check the bigger view for context. Short timeframes are noisy.
54.mp3 | Check yourself: five one-minute candles, the last closes at sixty thousand ninety. The five-minute close?
55.mp3 | Sixty thousand ninety. The five-minute close is always the last one-minute close.
56.mp3 | Great work! Next up: trend and market structure.
57.mp3 | See you in lesson sixteen.

### T16 · Trend and Market Structure (57 clips → content/futures-edge/T16/voice/)

00.mp3 | Lesson sixteen: trend and market structure.
01.mp3 | We'll read the shape of price, one peak and dip at a time.
02.mp3 | Here is a fictional B-T-C chart. Is price going up, down, or nowhere?
03.mp3 | One candle cannot tell you. Look at the peaks and the dips instead.
04.mp3 | The pattern they make is called market structure.
05.mp3 | It describes the past. It does not promise the future.
06.mp3 | A swing high is a peak: price rose, then turned down.
07.mp3 | A swing low is a dip: price fell, then turned up.
08.mp3 | Think of a hilly road. The hilltops are swing highs, the valleys swing lows.
09.mp3 | A peak is only clear after price turns away from it.
10.mp3 | An uptrend has higher highs and higher lows.
11.mp3 | Each peak tops the last one: sixty thousand one hundred, then sixty thousand two hundred, then sixty thousand three hundred.
12.mp3 | Each dip stays above the last one: fifty-nine thousand nine hundred eighty, then sixty thousand eighty, then sixty thousand one hundred eighty.
13.mp3 | Like climbing stairs: a step up, a small step back, then up again.
14.mp3 | Higher high means higher high. Higher low means higher low.
15.mp3 | A downtrend is the mirror: lower highs and lower lows.
16.mp3 | Peaks: sixty thousand three hundred twenty, then sixty thousand two hundred twenty, then sixty thousand one hundred twenty. Each one is lower.
17.mp3 | Dips: sixty thousand two hundred, then sixty thousand one hundred, then sixty thousand. Lower high and lower low for short.
18.mp3 | Lower highs, lower lows: a downtrend, so far.
19.mp3 | Sideways means neither: highs and lows stay at about the same levels.
20.mp3 | Peaks near sixty thousand two hundred, dips near sixty thousand. Price moves, but goes nowhere.
21.mp3 | This is also called a range. No clear direction is an answer too.
22.mp3 | Now watch structure change as price writes the chart.
23.mp3 | Higher highs, higher lows: an uptrend.
24.mp3 | Each new label appears only after price turns. That is how swings work.
25.mp3 | Then a peak that is not higher: the climb stalls, sideways.
26.mp3 | A lower high, then a lower low. The structure has turned down.
27.mp3 | Structure tells you what changed. It cannot tell you what comes next.
28.mp3 | Let's check with numbers. Compare each peak with the last peak.
29.mp3 | Sixty thousand two hundred forty minus sixty thousand two hundred ninety is minus fifty. A lower high.
30.mp3 | Sixty thousand sixty minus sixty thousand one hundred fifty is minus ninety. A lower low.
31.mp3 | Both changed: the uptrend's pattern of higher highs and lows is broken.
32.mp3 | A common mistake: one big green candle does not make an uptrend. [firmer, slower]
33.mp3 | Here, a big jump, but the highs and lows are still falling. [firmer, slower]
34.mp3 | Trend comes from the pattern of swings, not from one candle. [firmer, slower]
35.mp3 | And always say which timeframe you mean. [firmer, slower]
36.mp3 | Your turn. Three fictional charts: A, B and C.
37.mp3 | Which is an uptrend, which a downtrend, which sideways? Pause if you need time.
38.mp3 | A: lower highs and lower lows. A downtrend.
39.mp3 | B: highs and lows at the same levels. Sideways.
40.mp3 | C: higher highs and higher lows. An uptrend.
41.mp3 | Well done if you got all three.
42.mp3 | Be honest about the limits. Spotting swings is partly a judgement call.
43.mp3 | Two people can mark the same chart differently, and both can be fair.
44.mp3 | Tiny wiggles are usually ignored. A different timeframe can show a different trend.
45.mp3 | Before we move on, a few honest limits. [firmer, slower]
46.mp3 | A trend can end at any time, often without warning. [firmer, slower]
47.mp3 | Buying late into a long trend can mean buying near the top. [firmer, slower]
48.mp3 | Structure is not a signal to trade. Wait and no trade are always allowed. [firmer, slower]
49.mp3 | Let's recap.
50.mp3 | Uptrend: higher highs and higher lows. Downtrend: lower highs and lower lows.
51.mp3 | Sideways: highs and lows stay at about the same levels.
52.mp3 | Swings are only clear after price turns, and they are a judgement call.
53.mp3 | Check yourself: peaks sixty thousand three hundred then sixty thousand two hundred forty; dips sixty thousand one hundred fifty then sixty thousand sixty. What is it?
54.mp3 | Lower highs and lower lows: a downtrend, so far.
55.mp3 | Great work! Next up: support, resistance, breakout and fakeout.
56.mp3 | See you in lesson seventeen.

### T17 · Support, Resistance, Breakout, Fakeout (53 clips → content/futures-edge/T17/voice/)

00.mp3 | Lesson seventeen: support, resistance, breakout and fakeout.
01.mp3 | The price areas traders watch, and how to read them calmly.
02.mp3 | In lesson sixteen, you marked swing highs and swing lows on a chart.
03.mp3 | Look closely. Price keeps turning back near the same two areas.
04.mp3 | Why does that happen? And what if price finally pushes through?
05.mp3 | Support is a price area where falling price has stopped and turned up before.
06.mp3 | Think of a floor. Price drops, lands on it, and bounces.
07.mp3 | Here, price fell to about fifty-nine thousand eight hundred fifty three times. Each touch is called a test.
08.mp3 | Buyers stepped in there before. That is all support tells you: what happened before.
09.mp3 | Resistance is the opposite: an area where rising price has stopped and turned down.
10.mp3 | Like a ceiling. Price climbs, bumps into it, and falls back.
11.mp3 | Here, rallies stalled near sixty thousand three hundred fifty twice. Sellers were waiting there before.
12.mp3 | An important detail: support and resistance are zones, not exact lines.
13.mp3 | The three lows were fifty-nine thousand eight hundred thirty, fifty-nine thousand eight hundred sixty and fifty-nine thousand eight hundred eighty. Not one exact price.
14.mp3 | So we draw a band from fifty-nine thousand eight hundred to fifty-nine thousand nine hundred. That zone is one hundred U-S-D-T tall.
15.mp3 | Price can poke into a zone, or a little through it, without anything changing.
16.mp3 | A breakout is when price closes beyond a zone and keeps going.
17.mp3 | Our resistance zone runs from sixty thousand three hundred to sixty thousand four hundred. Watch this candle.
18.mp3 | It closes at sixty thousand four hundred eighty: a full eighty U-S-D-T above the top of the zone.
19.mp3 | Then price comes back to the zone from above. That's a retest. Here, it holds.
20.mp3 | The old ceiling acted like a floor. This time.
21.mp3 | Now the same chart, with a different ending.
22.mp3 | A fakeout, or false breakout, is when price pokes beyond a zone, then falls back inside.
23.mp3 | The wick reaches sixty thousand four hundred sixty, but the candle closes at sixty thousand three hundred fifty, back inside the zone.
24.mp3 | Then price drops toward sixty thousand one hundred fifty. Same past chart, two different futures.
25.mp3 | So what counts as confirmation? Evidence that a breakout is holding.
26.mp3 | One: a candle closes beyond the zone. A wick alone is not enough.
27.mp3 | Two: the next candles stay beyond it, too.
28.mp3 | Three: if price comes back for a retest, the zone holds.
29.mp3 | Confirmation makes a breakout more believable. It never makes it certain. [firmer, slower]
30.mp3 | A common mistake: drawing one exact line and expecting price to obey it. [firmer, slower]
31.mp3 | Or jumping in the moment a wick crosses that line. [firmer, slower]
32.mp3 | The fix: draw zones, wait for candles to close, and treat every level as a maybe. [firmer, slower]
33.mp3 | And wait is always allowed. You never have to act on a level. [firmer, slower]
34.mp3 | Your turn. The resistance zone is sixty thousand three hundred to sixty thousand four hundred.
35.mp3 | The last candle wicked to sixty thousand four hundred fifty but closed at sixty thousand three hundred eighty. Is the breakout confirmed?
36.mp3 | Not yet. The close, sixty thousand three hundred eighty, is still twenty U-S-D-T inside the zone.
37.mp3 | A sensible choice here is wait, and watch where the next candle closes.
38.mp3 | One more warning. Liquidity means how many orders are waiting near the price. [firmer, slower]
39.mp3 | When liquidity is thin, only a few small orders are waiting.
40.mp3 | Then one larger order can jump price through a zone, and it snaps back moments later.
41.mp3 | It looked like a breakout. It was just a thin market.
42.mp3 | Before you use any of this, know the limits. [firmer, slower]
43.mp3 | Lines come from past prices. They promise nothing about the future. [firmer, slower]
44.mp3 | Fakeouts are common, thin markets can fake a breakout, and stops can slip. [firmer, slower]
45.mp3 | Losses are always possible. Wait is a decision, not a failure. [firmer, slower]
46.mp3 | Let's recap.
47.mp3 | Support and resistance are zones where price turned before. Not walls.
48.mp3 | A breakout closes beyond a zone and holds. A fakeout falls back inside.
49.mp3 | Confirmation is evidence, not certainty. Wait is always allowed.
50.mp3 | Check yourself: a wick crosses resistance, but the candle closes inside. Breakout?
51.mp3 | Not confirmed. It could be a fakeout. Wait for a close beyond the zone.
52.mp3 | Well done! Next up: volume, volatility and range. See you in lesson eighteen.

### T18 · Volume, Volatility and Range (57 clips → content/futures-edge/T18/voice/)

00.mp3 | Lesson eighteen: volume, volatility and range.
01.mp3 | Three ways to describe how busy and how jumpy a market is.
02.mp3 | In lesson seventeen, you met zones, breakouts and fakeouts.
03.mp3 | Here are two fictional charts. Both start at sixty thousand and end at sixty thousand one hundred.
04.mp3 | Same change in price. A very different ride. Let's measure it.
05.mp3 | Volume is how much was traded in a period of time.
06.mp3 | Think of a shop counting how many items it sold each minute.
07.mp3 | In this fictional minute, trades of two, five, three and two B-T-C go through.
08.mp3 | Add them up: twelve B-T-C. That is this candle's volume.
09.mp3 | At sixty thousand U-S-D-T each, that's about seven hundred twenty thousand U-S-D-T traded.
10.mp3 | On most charts, volume shows as bars under the candles.
11.mp3 | Each bar sits under its own candle, and covers the same minute.
12.mp3 | A short bar means a quiet minute. A tall bar means a busy one.
13.mp3 | Here, the busiest minutes came with big moves. Often, not always.
14.mp3 | Range is the distance between the high and the low.
15.mp3 | Like the gap between the warmest and coldest hour of a day.
16.mp3 | This candle's high is sixty thousand three hundred and its low is sixty thousand. Range: three hundred U-S-D-T.
17.mp3 | As a percent: three hundred divided by sixty thousand times one hundred equals zero point five percent. We divide by the low.
18.mp3 | Volatility is how much, and how fast, price moves around.
19.mp3 | Like a calm lake versus a choppy sea.
20.mp3 | On the left, four quiet candles. Their ranges average forty U-S-D-T.
21.mp3 | On the right, four volatile candles. Ranges average two hundred fifty U-S-D-T.
22.mp3 | More volatility means bigger swings, both ways.
23.mp3 | Traders often check the previous high and low of the last few minutes.
24.mp3 | This box is a lookback window: the last ten one-minute candles.
25.mp3 | Highest high sixty thousand three hundred. Lowest low sixty thousand. Range three hundred U-S-D-T, or zero point five percent.
26.mp3 | Now stretch it to fifteen minutes. An older high, sixty thousand six hundred, joins in.
27.mp3 | Range doubles: six hundred U-S-D-T, one percent. Your window changes the answer.
28.mp3 | Let's compare two fictional fifteen-minute windows.
29.mp3 | Window A: range one hundred fifty U-S-D-T, zero point two five percent, and low volume.
30.mp3 | Window B: range nine hundred U-S-D-T, one point five percent, and high volume.
31.mp3 | In A, round-trip fees of zero point one percent, sixty U-S-D-T per B-T-C, eat a big part of the range.
32.mp3 | In B, moves are bigger, but so are the swings against you.
33.mp3 | Volume also hints at liquidity: how many orders wait near the price.
34.mp3 | Busy book: a two B-T-C market buy fills at sixty thousand.
35.mp3 | Thin book: one B-T-C fills at sixty thousand, the other at sixty thousand one hundred.
36.mp3 | Average sixty thousand fifty. That's fifty U-S-D-T per B-T-C worse: slippage.
37.mp3 | Quiet times often mean thin books.
38.mp3 | A common mistake: a huge volume bar means strong buyers. Go long! [firmer, slower]
39.mp3 | But every trade has a buyer and a seller. Forty B-T-C bought means forty B-T-C sold. [firmer, slower]
40.mp3 | Volume shows how busy it was, not who wins next. [firmer, slower]
41.mp3 | Read it with candles and zones. Wait is still allowed. [firmer, slower]
42.mp3 | Your turn. In the last ten minutes, the high was sixty thousand two hundred forty and the low sixty thousand.
43.mp3 | What is the range in U-S-D-T, and as a percent? Pause if you need to.
44.mp3 | Range: sixty thousand two hundred forty minus sixty thousand equals two hundred forty U-S-D-T. Then two hundred forty divided by sixty thousand times one hundred equals zero point four percent.
45.mp3 | That tells you how far price travelled. Not where it goes next.
46.mp3 | Before you lean on these numbers, know the limits. [firmer, slower]
47.mp3 | A past range is history. The next minutes can be calmer, or much wilder. [firmer, slower]
48.mp3 | Volatility can jump fast. With leverage, big swings reach liquidation sooner. [firmer, slower]
49.mp3 | Thin volume can mean slippage. And wait is always a valid choice. [firmer, slower]
50.mp3 | Let's recap.
51.mp3 | Volume is how much traded. It shows activity, not direction.
52.mp3 | Range is high minus low. Volatility is how big and fast the swings are.
53.mp3 | The lookback window you choose changes the range. Past ranges promise nothing.
54.mp3 | Check yourself: a huge green volume bar. Does it prove price will rise?
55.mp3 | No. Volume shows activity, not direction. Every buy had a seller.
56.mp3 | Well done! Phase five starts next: what is scalping? See you in lesson nineteen.

## Phase 5 · Scalping & Risk Management


### T19 · What Is Scalping? (54 clips → content/futures-edge/T19/voice/)

00.mp3 | Lesson nineteen, and the start of Phase five: scalping and risk management. [firmer, slower]
01.mp3 | First question: what is scalping?
02.mp3 | So far you've learned to read candles, timeframes, trends, zones and volume.
03.mp3 | Now: how do short-term traders use them? And what does it really cost?
04.mp3 | Let's look honestly, costs and all.
05.mp3 | Scalping means trying to profit from small price moves, in trades that last minutes.
06.mp3 | Sometimes only seconds. Then the trader exits and waits for the next one.
07.mp3 | Think of a stall that makes many small sales, each with a thin margin.
08.mp3 | Thin margins mean costs matter a lot.
09.mp3 | Here's a fictional fifteen-minute chart of one-minute candles.
10.mp3 | A scalper might notice two things. These are observations, not signals.
11.mp3 | One: price dips to a support zone and holds. Two: a sudden spike on thin volume.
12.mp3 | Say a demo long opens at sixty thousand and closes four minutes later at sixty thousand one hundred twenty.
13.mp3 | Held for four minutes. Price move: plus one hundred twenty U-S-D-T. It could have failed.
14.mp3 | Now the costs. The position is zero point one B-T-C: six thousand U-S-D-T at sixty thousand.
15.mp3 | Gross profit: zero point one times one hundred twenty equals twelve U-S-D-T.
16.mp3 | Fees at an example zero point zero five percent each side: three to enter, three point zero one to exit.
17.mp3 | Net: twelve minus three minus three point zero one equals five point nine nine U-S-D-T. Half the move went to fees.
18.mp3 | A losing scalp pays fees too, so the loss gets bigger.
19.mp3 | Trade frequency is how many trades you make in a period.
20.mp3 | Each round trip here costs about six U-S-D-T in fees.
21.mp3 | Twenty trades in a day: about one hundred twenty U-S-D-T in fees, win or lose.
22.mp3 | And every trade is one more chance to be wrong.
23.mp3 | More trades is not more profit.
24.mp3 | Execution quality is how close your fill is to the price you expected.
25.mp3 | Say you slip ten U-S-D-T getting in and ten getting out.
26.mp3 | Our one hundred twenty move shrinks to one hundred, before fees.
27.mp3 | When moves are small, spread and slippage take a big share.
28.mp3 | How does scalping compare with holding for days or weeks?
29.mp3 | Scalping: minutes, many trades, costs are a big share of each small move.
30.mp3 | Longer holding: fewer trades, bigger moves, but more time exposed to news.
31.mp3 | Neither is safe. Both can lose money.
32.mp3 | A note on Zora. It looks at about ten to fifteen minutes of recent price for context.
33.mp3 | That is an analysis horizon. It is not a time you must hold a trade.
34.mp3 | And it is not a promise of where price will be in fifteen minutes.
35.mp3 | Some moments are simply not good for trading.
36.mp3 | Very thin markets. Wild news spikes. Fees bigger than the expected move.
37.mp3 | No clear reason, no stop, or you're tired, upset or chasing a loss.
38.mp3 | In all of these, no trade is the right call. Waiting is a skill.
39.mp3 | Your turn. A scalp's expected move is sixty U-S-D-T per B-T-C, at a price of sixty thousand.
40.mp3 | Round-trip fees are zero point one percent. Is it worth taking? Pause and think.
41.mp3 | Fees: sixty thousand times zero point one percent equals sixty U-S-D-T per B-T-C. The move only covers the fees.
42.mp3 | Even before slippage, it's zero. No trade makes sense.
43.mp3 | Before you try scalping, even in demo, know the limits. [firmer, slower]
44.mp3 | It is not easy money. Many small losses and fees add up fast. [firmer, slower]
45.mp3 | Fast decisions bring mistakes, and leverage makes every loss bigger. [firmer, slower]
46.mp3 | Practise in demo first. No trade is always allowed. [firmer, slower]
47.mp3 | Let's recap.
48.mp3 | Scalping aims for small moves in short trades: seconds to minutes.
49.mp3 | Fees, spread and slippage take a big share of small moves.
50.mp3 | Zora's ten to fifteen minutes is context, not a holding rule. No trade is allowed.
51.mp3 | Check yourself: a move of sixty U-S-D-T per B-T-C, fees of sixty. Worth it?
52.mp3 | No. It only covers fees, before slippage. Waiting is the better call.
53.mp3 | Well done! Next up: evaluating an entry opportunity. See you in lesson twenty.

### T20 · Evaluating an Entry Opportunity (44 clips → content/futures-edge/T20/voice/)

00.mp3 | Lesson twenty: evaluating an entry opportunity. A careful checklist that can end in no trade.
01.mp3 | Here's a fictional B-T-C chart. The last few candles are green, and price is near sixty thousand.
02.mp3 | It's tempting to press buy right now. But what do we actually know?
03.mp3 | Instead of guessing, let's check the chart step by step.
04.mp3 | An entry opportunity is a moment when you consider opening a trade. Considering is not entering.
05.mp3 | Like a pilot before take-off: the same checks, in the same order, every time.
06.mp3 | Trend, range, zones, volume, risk. Only then a tentative decision: buy, sell or wait. [firmer, slower]
07.mp3 | Step one: the trend. A trend is the general direction price has been moving.
08.mp3 | Over this hour, the lows kept getting higher. That leans up.
09.mp3 | But the last high was lower than the one before. So: up, but choppy. Not a clear signal.
10.mp3 | Step two: the recent range. The space between the recent high and the recent low.
11.mp3 | Over the last eight candles: high sixty thousand one hundred, low fifty-nine thousand five hundred. That's six hundred U-S-D-T.
12.mp3 | Six hundred out of sixty thousand is about one percent. And price now sits near the top of this box.
13.mp3 | Step three: zones. Support is like a floor where falls often paused. Resistance is like a ceiling.
14.mp3 | Here, resistance sits at sixty thousand fifty to sixty thousand one hundred fifty. Support sits at fifty-nine thousand five hundred to fifty-nine thousand six hundred.
15.mp3 | Price is at sixty thousand, just under resistance. Only about fifty U-S-D-T of room before the ceiling.
16.mp3 | Step four: volume is how much was traded in each candle. Liquidity is how easily you can trade.
17.mp3 | The big drop and first push up had high volume. This last push up has less and less.
18.mp3 | Fading volume is a weak sign, not proof. Volume alone never tells you the direction. [firmer, slower]
19.mp3 | Step five: your risk budget. The most you accept to lose on this one trade, decided before entering. [firmer, slower]
20.mp3 | Example only: a one thousand U-S-D-T practice account, and a risk budget of ten U-S-D-T. [firmer, slower]
21.mp3 | A stop below support at fifty-nine thousand four hundred is six hundred U-S-D-T away: one percent. Sized for that, a loss is about ten U-S-D-T. [firmer, slower]
22.mp3 | If price reaches sixty thousand one hundred, the gain is only about one point seven U-S-D-T, and fees take about one of it. [firmer, slower]
23.mp3 | Step six: a tentative decision. Buy, sell or wait, and you write down why.
24.mp3 | Mild uptrend, but price is under resistance, volume is fading, and the reward is tiny next to the risk. [firmer, slower]
25.mp3 | So the decision is wait. No trade is a real, sensible result of the checklist.
26.mp3 | A common mistake: deciding the direction first, then looking for reasons to agree. [firmer, slower]
27.mp3 | Green candles alone are not a reason. Work through the checklist in order, and write your why. [firmer, slower]
28.mp3 | And wait is not a failure. It's often the best answer when the signals don't line up. [firmer, slower]
29.mp3 | Your turn. A different fictional coin, checklist filled in. What's the sensible tentative decision?
30.mp3 | Pause if you need more time. Is it A, B or C?
31.mp3 | C, wait. Every signal is neutral, so there's no reason to take the risk. [firmer, slower]
32.mp3 | A is tempting, but one green candle is not a reason. Neutral signals mean no trade.
33.mp3 | Before using any checklist, know its limits. [firmer, slower]
34.mp3 | A checklist cannot predict the future. Price can still move against you. [firmer, slower]
35.mp3 | Stops can slip, and fees eat small gains. Leverage makes losses bigger. [firmer, slower]
36.mp3 | These are fictional examples, not advice. When signals are unclear, wait is always allowed. [firmer, slower]
37.mp3 | Let's recap.
38.mp3 | One: check in order. Trend, range, zones, volume, then your risk budget. [firmer, slower]
39.mp3 | Two: a decision needs reasons. Write down why, not only the direction.
40.mp3 | Three: when signals are neutral or mixed, wait is a real decision.
41.mp3 | Check yourself: price is just under resistance and volume is fading. A strong buy?
42.mp3 | No. Those are reasons to wait.
43.mp3 | Next up: T twenty-one, confirmation, false signals and no trade. Why waiting is a decision too.

### T21 · Confirmation, False Signals and NO_TRADE (49 clips → content/futures-edge/T21/voice/)

00.mp3 | Lesson twenty-one: confirmation, false signals and no trade. Why waiting is a decision too.
01.mp3 | Here's a fictional B-T-C chart. Twice, price climbed to about sixty thousand and turned back down.
02.mp3 | Now it's back near that zone, at fifty-nine thousand nine hundred seventy. Tempting to think: this time it breaks out!
03.mp3 | But from this same past, price could break out to sixty thousand three hundred fifty, drift sideways, or fall to fifty-nine thousand six hundred fifty.
04.mp3 | Nobody knows in advance which one will happen.
05.mp3 | Confirmation is extra evidence, after a signal, that supports an idea. You met it in T seventeen.
06.mp3 | For a breakout: a candle closes beyond the zone, and the next candles hold there.
07.mp3 | Think of dark clouds. They make rain more likely, but don't promise it.
08.mp3 | Confirmation can raise or lower the odds. It cannot tell you what the next candle will do.
09.mp3 | Not all evidence is equal. Weak evidence is small or easy to fake, like one wick above a level.
10.mp3 | Conflicting evidence points in different directions at the same time.
11.mp3 | Here, the trend leans up, but price is under resistance and volume is fading.
12.mp3 | When evidence is weak or mixed, the scale doesn't tip. That's a reason for no trade.
13.mp3 | A false signal looks real but doesn't follow through. A false breakout is the classic one.
14.mp3 | Watch this candle. It pokes up to sixty thousand ninety, above the zone, then closes at fifty-nine thousand nine hundred sixty, back below.
15.mp3 | Say someone bought zero point zero one B-T-C at sixty thousand sixty on that poke. At the close: minus one U-S-D-T, before fees.
16.mp3 | A wick above a level is not a close above it.
17.mp3 | Momentum is how strongly price is moving. A fade is when each push gets smaller.
18.mp3 | Like a ball rolled uphill: it keeps going for a while, but slower and slower.
19.mp3 | Here, four green candles gain eighty, then fifty, then twenty-five, then only ten U-S-D-T.
20.mp3 | A fade is a warning sign, not proof. Price can fade, then push on again. [firmer, slower]
21.mp3 | Hindsight bias: after you see what happened, it feels like it was obvious all along.
22.mp3 | Looking back at this chart, the breakout seems certain. Of course it went up!
23.mp3 | But at decision time, the right side was hidden. You only had this.
24.mp3 | Old charts look clearer than live ones. Judge a decision by what was known at the time.
25.mp3 | No trade means you looked, and decided not to open a position. It's an active choice.
26.mp3 | Like a batter leaving a ball outside off stump. You don't have to play every ball.
27.mp3 | Write down what you'd need to see. For example: a five-minute close above sixty thousand fifty, then a hold.
28.mp3 | Until then: no trade. No fees, no new risk. At most, you miss a move. [firmer, slower]
29.mp3 | A common mistake: judging a decision only by what happened next. [firmer, slower]
30.mp3 | You waited, then price went up. Was waiting wrong? Not if the evidence was weak. [firmer, slower]
31.mp3 | A good decision can have a bad outcome, and a bad one can get lucky. [firmer, slower]
32.mp3 | So review your reasons, not just the result. Was the evidence clear, or were you guessing? [firmer, slower]
33.mp3 | Your turn. Same zone, sixty thousand to sixty thousand fifty. Let's reveal new candles one at a time.
34.mp3 | Candle one wicks to sixty thousand seventy but closes at sixty thousand thirty, inside the zone. Two small candles follow.
35.mp3 | Volume is falling. What's sensible: A, buy, B, sell, or C, wait? Pause if you need more time.
36.mp3 | C, wait. No candle closed above the zone, and the pushes are fading. Weak evidence.
37.mp3 | A is tempting, but a wick is not a breakout. And B? Nothing confirms a drop either.
38.mp3 | Before you rely on confirmation, know its limits. [firmer, slower]
39.mp3 | Confirmed signals still fail. And waiting for confirmation often means a worse entry. [firmer, slower]
40.mp3 | False breakouts can trigger stops, and stops can slip. Leverage makes each loss bigger. [firmer, slower]
41.mp3 | These are fictional examples, not advice. No trade is always allowed. [firmer, slower]
42.mp3 | Let's recap.
43.mp3 | One: confirmation is evidence, not certainty. The same past can lead to different futures.
44.mp3 | Two: weak or conflicting evidence, a false breakout or a fading push are reasons for care.
45.mp3 | Three: no trade is a real decision. Judge it by your reasons, not the result.
46.mp3 | Check yourself: you waited, then price rose. Was waiting a mistake? [firmer, slower]
47.mp3 | Not if the evidence was weak. Judge the reasons.
48.mp3 | Next up: T twenty-two, position sizing and risk budget. Size a position from the risk you accept. [firmer, slower]

### T22 · Position Sizing and Risk Budget (50 clips → content/futures-edge/T22/voice/)

00.mp3 | Lesson twenty-two: position sizing and risk budget. Size a position from the risk you accept. [firmer, slower]
01.mp3 | Two traders, one fictional chart. Both buy B-T-C at sixty thousand, with a stop-loss at fifty-nine thousand four hundred.
02.mp3 | Trader A's position is worth five hundred U-S-D-T. Trader B's is worth ten thousand U-S-D-T.
03.mp3 | Price falls to the stop. A loses five U-S-D-T. B loses one hundred U-S-D-T. Same stop, very different damage.
04.mp3 | Your account balance is the money in your trading account. Here, a one thousand U-S-D-T practice account. [firmer, slower]
05.mp3 | Your risk budget is the most you accept to lose on one trade, decided before you enter. [firmer, slower]
06.mp3 | Like deciding how much you'll spend at a fair before you go, not halfway through. [firmer, slower]
07.mp3 | In this example the budget is ten U-S-D-T. An example only, not a recommendation. [firmer, slower]
08.mp3 | Stop distance is the gap between your entry price and your stop-loss price.
09.mp3 | Entry sixty thousand, stop fifty-nine thousand four hundred: the distance is six hundred U-S-D-T. As a share of entry, six hundred divided by sixty thousand equals one percent.
10.mp3 | For a short, the stop sits above entry. Entry sixty thousand, stop sixty thousand three hundred: three hundred U-S-D-T, or zero point five percent.
11.mp3 | Position size is how much of the coin you hold. Notional is what it's worth: size times price.
12.mp3 | Zero point zero one B-T-C at sixty thousand U-S-D-T is a notional of six hundred U-S-D-T.
13.mp3 | If price falls one percent to the stop, you lose one percent of the notional: six hundred times one percent equals six U-S-D-T.
14.mp3 | Like buying rice: if the price per kilo drops, ten kilos lose ten times more than one.
15.mp3 | Turn it around to find the allowed notional.
16.mp3 | Allowed notional about risk amount divided by stop distance as a share of entry. [firmer, slower]
17.mp3 | Ten divided by (six hundred divided by sixty thousand) equals ten divided by zero point zero one equals one thousand U-S-D-T. That's about zero point zero one six seven B-T-C at sixty thousand.
18.mp3 | For the short, with a zero point five percent stop: ten divided by zero point zero zero five equals two thousand U-S-D-T.
19.mp3 | This simple model ignores fees, slippage, contract rules and liquidation. [firmer, slower]
20.mp3 | Leverage lets a small margin control a bigger notional. Leverage equals notional divided by margin. [firmer, slower]
21.mp3 | A one thousand U-S-D-T notional needs five hundred margin at two ex, two hundred at five ex, one hundred at ten ex. [firmer, slower]
22.mp3 | But the loss at the stop is still about ten U-S-D-T. It depends on notional and stop distance. [firmer, slower]
23.mp3 | High leverage makes huge positions easy to open, and brings liquidation closer. [firmer, slower]
24.mp3 | Drawdown is how far your account falls from its highest point, shown in percent.
25.mp3 | Five ten U-S-D-T losses take one thousand down to nine hundred fifty. A five percent drawdown.
26.mp3 | Five one hundred U-S-D-T losses take it to five hundred. A fifty percent drawdown.
27.mp3 | From five hundred, you'd need plus one hundred percent just to get back to one thousand. Small risks keep drawdowns small. [firmer, slower]
28.mp3 | A common mistake: choosing leverage or size first, like 'I'll use twenty ex', then hoping. [firmer, slower]
29.mp3 | The fix is a fixed order: risk budget, then stop, then notional, then check the margin. [firmer, slower]
30.mp3 | And if the allowed size is too small to make sense, no trade is a fine answer. [firmer, slower]
31.mp3 | Your turn. Account two thousand U-S-D-T, example budget twenty U-S-D-T. Long at fifty thousand, stop at forty-nine thousand five hundred.
32.mp3 | What's the allowed notional? A: two hundred, B: two thousand, or C: twenty thousand U-S-D-T? Pause and work it out.
33.mp3 | B. The stop is five hundred away, which is one percent. So twenty divided by zero point zero one equals two thousand U-S-D-T.
34.mp3 | C is tempting, but at the stop it loses two hundred U-S-D-T, ten times the budget.
35.mp3 | A calculator should warn you when inputs make no sense. [firmer, slower]
36.mp3 | Stop equal to entry? The distance is zero, so there is no sensible size.
37.mp3 | A long with the stop above entry? That stop is on the wrong side.
38.mp3 | A risk budget bigger than the whole account? That's impossible. [firmer, slower]
39.mp3 | Know the limits of this maths. [firmer, slower]
40.mp3 | Stops can slip, and fees add to the loss. The real loss can be bigger than planned. [firmer, slower]
41.mp3 | With high leverage, liquidation can come before your stop. Exchanges also set minimum sizes. [firmer, slower]
42.mp3 | Fictional examples, not advice or recommended percentages. No trade is always allowed. [firmer, slower]
43.mp3 | Let's recap.
44.mp3 | One: decide your risk budget before you enter. Examples here are not recommendations. [firmer, slower]
45.mp3 | Two: allowed notional about risk divided by stop distance as a share of entry. A simple model. [firmer, slower]
46.mp3 | Three: leverage changes the margin, not the loss at the stop. Watch drawdown. [firmer, slower]
47.mp3 | Check yourself: risk ten U-S-D-T, stop two percent away. Allowed notional? [firmer, slower]
48.mp3 | About five hundred U-S-D-T: ten divided by zero point zero two equals five hundred.
49.mp3 | Next up: T twenty-three, the full scalping decision lifecycle. From chart to journal, in a demo.

### T23 · Full Scalping Decision Lifecycle (61 clips → content/futures-edge/T23/voice/)

00.mp3 | Lesson twenty-three: the full scalping decision lifecycle, from chart to journal.
01.mp3 | This is the capstone: T fourteen to T twenty-two, used together on one fictional chart.
02.mp3 | Eight steps, in the same order every time, from choosing a coin to writing a journal.
03.mp3 | It's an educational simulation, in demo mode. No real money, no real orders.
04.mp3 | And we score the process, not the profit.
05.mp3 | Step one: choose a coin. In this simulation, the coins and all prices are made up.
06.mp3 | Liquidity means how easily you can buy or sell without moving the price much.
07.mp3 | B-T-C U-S-D-T has many traders and a tiny spread. X-Y-Z U-S-D-T is thin: a one percent spread.
08.mp3 | Thin coins slip more. So we pick B-T-C U-S-D-T, on a one thousand U-S-D-T demo account.
09.mp3 | Step two: context. First the five-minute chart, for the bigger picture of the last hour.
10.mp3 | Higher highs and higher lows. So on five minutes, the trend leans up. Trends can still end.
11.mp3 | Now zoom into the last fifteen minutes on the one-minute chart. Same prices, more detail.
12.mp3 | The one-minute chart is noisier: a run up, then a pull-back. Use it for detail, not direction.
13.mp3 | Step three: range and levels. Over fifteen minutes, the high was sixty thousand six hundred fifty and the low fifty-nine thousand eight hundred fifty.
14.mp3 | That's a range of eight hundred U-S-D-T, about one point three percent of the price.
15.mp3 | Twice, price dipped into fifty-nine thousand eight hundred fifty to fifty-nine thousand nine hundred fifty and bounced. That's our support zone.
16.mp3 | Resistance sits near the top, sixty thousand five hundred fifty to sixty thousand six hundred fifty. Price is now sixty thousand, just above support.
17.mp3 | Step four: write down what you're unsure about. Beginners often skip this step.
18.mp3 | What I lean towards: a bounce up from support, because the five-minute trend is up.
19.mp3 | What argues against it: support was already tested twice, and it could break.
20.mp3 | What would prove me wrong: a fall below fifty-nine thousand seven hundred. Confidence: medium, not certain.
21.mp3 | Step five: costs and risk, before any button. Example numbers only, not a recommendation. [firmer, slower]
22.mp3 | Entry near sixty thousand. Stop at fifty-nine thousand seven hundred, just under support. That's three hundred U-S-D-T away: zero point five percent. [firmer, slower]
23.mp3 | Example budget: six U-S-D-T. Fees at zero point zero five percent each way take about one, leaving five for the price move. [firmer, slower]
24.mp3 | Five divided by zero point five percent gives a notional of about one thousand U-S-D-T. No leverage needed. [firmer, slower]
25.mp3 | Stop hit: about minus six U-S-D-T with fees. Target sixty thousand six hundred hit: plus ten minus fees, about plus nine U-S-D-T. [firmer, slower]
26.mp3 | Step six: decide. Demo buy, demo sell or no trade. All three are allowed.
27.mp3 | Whatever you choose, write one or two lines of why. A direction alone is not a reason.
28.mp3 | Here: trend up, a bounce at support, and a planned loss of about six U-S-D-T, inside the budget.
29.mp3 | So this learner picks demo buy, with the stop and target set at the same time.
30.mp3 | Step seven: monitor and exit. From here, price could go up, sideways or down.
31.mp3 | Nobody knows which path will come. That's why the stop and target were set first.
32.mp3 | Now the replay. Price rises to sixty thousand four hundred. Tempting to dream, but the plan stays the same.
33.mp3 | Then it turns, breaks support, and hits the stop. The fill is fifty-nine thousand six hundred eighty: twenty U-S-D-T of slippage.
34.mp3 | The exit happens as planned, about eight minutes in. No moving the stop, no adding more.
35.mp3 | Step eight: the journal. Write what you planned, what happened, and what you learned.
36.mp3 | Price result: minus five point three three U-S-D-T. Fees: minus one. Net: minus six point three three U-S-D-T, close to the plan.
37.mp3 | Did we follow the plan? Yes: size, stop and exit all as written. Process score: eight of eight.
38.mp3 | A good process can still lose. Judge decisions by the process, not by one outcome.
39.mp3 | Now the other route. Another learner saw the same chart and the same numbers.
40.mp3 | Their notes: support tested twice, weak volume on the bounce, not confident. So: no trade.
41.mp3 | Result: zero U-S-D-T, no fees, and a journal entry. Process: complete. That's a success too.
42.mp3 | Not because of how the replay ended. They decided before knowing, with a clear reason.
43.mp3 | Three common mistakes. First: moving the stop further away as price gets close. [firmer, slower]
44.mp3 | That turns a planned six U-S-D-T loss into about eleven. Keep the stop where the plan put it. [firmer, slower]
45.mp3 | Second: doubling the size to win a loss back. That doubles the risk too. Take a break first. [firmer, slower]
46.mp3 | Third: judging only by profit. Judge the process, because good process can still lose. [firmer, slower]
47.mp3 | Your turn. The stop must go at fifty-nine thousand four hundred: one percent away. The budget for the move is still five U-S-D-T.
48.mp3 | About what notional fits? Pause if you need more time.
49.mp3 | B, about five hundred U-S-D-T. Five divided by one percent is five hundred. A wider stop means a smaller position.
50.mp3 | A is tempting, but one thousand U-S-D-T with a one percent stop risks ten U-S-D-T, double the budget. [firmer, slower]
51.mp3 | Honest limits. A simulation is not the market: real fills can slip more, and real money feels different. [firmer, slower]
52.mp3 | Even a careful plan loses often. Never trade money you can't afford to lose. [firmer, slower]
53.mp3 | This plan used no leverage. More leverage makes losses bigger and can lead to liquidation. [firmer, slower]
54.mp3 | Everything here is fictional and educational, not advice. No trade is always allowed. [firmer, slower]
55.mp3 | Recap. One: eight steps, in order, from choosing a coin to writing the journal.
56.mp3 | Two: your size comes from the risk budget and the stop distance, before deciding. [firmer, slower]
57.mp3 | Three: judge the process, not one outcome. No trade can be a full success.
58.mp3 | Check yourself: you followed the plan and still lost. Bad decision?
59.mp3 | Not necessarily. Check the process first.
60.mp3 | Next up: Checkpoint B, a review of T fourteen to T twenty-three. Well done for reaching the end of the lessons!

### CPB · Checkpoint B (39 clips → content/futures-edge/CPB/voice/)

00.mp3 | Checkpoint B, the last stop. Let's review Phases four and five: charts, scalping and risk. [firmer, slower]
01.mp3 | Eight questions on T fourteen to T twenty-three: chart reading, risk maths and demo decisions. [firmer, slower]
02.mp3 | Read each question, pick an answer, and pause the video whenever you need more time. [firmer, slower]
03.mp3 | Not graded here. The graded Checkpoint B quiz is in the interactive course.
04.mp3 | Question one, from T fourteen. Open sixty thousand, high sixty thousand three hundred, low fifty-nine thousand eight hundred, close sixty thousand two hundred. Which is true?
05.mp3 | A. It's a green, up candle, and the top of its body is the close: sixty thousand two hundred.
06.mp3 | B mixes up high and close. Sixty thousand three hundred is the top of the wick, the highest price traded.
07.mp3 | Question two, from T fifteen. Five one-minute candles become one five-minute candle. What are its prices?
08.mp3 | A. The first open, the highest high, the lowest low, and the last close.
09.mp3 | B is tempting, but candles don't average. They keep the real open, high, low and close.
10.mp3 | Question three, from T seventeen. Price breaks above resistance, then falls back below within two candles.
11.mp3 | B. It may be a fakeout. Wait for more evidence. No pattern is certain.
12.mp3 | A is the trap. A break alone is not confirmation, and buying on hope is not a plan.
13.mp3 | Question four, from T eighteen. A big green candle has very high volume. What can you conclude?
14.mp3 | B. A lot was traded. That's one clue, not proof of where price goes next.
15.mp3 | A is tempting, but volume alone never tells you the direction. [firmer, slower]
16.mp3 | Question five, from T nineteen. Each scalp makes plus zero point eight U-S-D-T gross, and fees cost one. After ten trades?
17.mp3 | B, minus two U-S-D-T. Each trade nets minus zero point two, and ten times minus zero point two is minus two.
18.mp3 | A forgets the fees. Many small trades mean many fees.
19.mp3 | Question six, from T twenty and T twenty-one. Mid-range, flat trend, low volume, no level near. Your decision?
20.mp3 | C, no trade. Nothing lines up, so waiting is the sensible decision.
21.mp3 | A is the trap: one green candle is not a reason to take a risk. [firmer, slower]
22.mp3 | Question seven, from T twenty-two. Risk budget ten U-S-D-T. Stop two percent from entry. About what notional? [firmer, slower]
23.mp3 | A, about five hundred U-S-D-T. Ten divided by two percent is five hundred.
24.mp3 | B uses the whole account. One thousand times two percent risks twenty U-S-D-T, double the budget. [firmer, slower]
25.mp3 | Question eight, from T twenty-three. Your demo stop slipped: minus six point three instead of minus six. What next?
26.mp3 | B. Journal it, check the process, and take a break. A small slip is normal.
27.mp3 | A is revenge trading. Doubling the size doubles the risk. [firmer, slower]
28.mp3 | Before you finish: critical safety. [firmer, slower]
29.mp3 | Leverage magnifies losses. No leverage is safe, and liquidation can take your margin. [firmer, slower]
30.mp3 | A stop-loss is a trigger, not a promise. Gaps and slippage happen. [firmer, slower]
31.mp3 | Never share passwords, O-T-P or two-factor codes, or A-P-I secret keys. Not even with 'support'. [firmer, slower]
32.mp3 | Size from your risk budget first. When signals are unclear, no trade is a real decision. [firmer, slower]
33.mp3 | Here's where to look if you missed one.
34.mp3 | One: T fourteen. Two: T fifteen. Three: T sixteen and T seventeen. Four: T eighteen.
35.mp3 | Five: T nineteen. Six: T twenty and T twenty-one. Seven: T twenty-two. Eight: T twenty-three.
36.mp3 | Rewatch any lesson, no penalty. Risk sizing and no trade deserve a second look. [firmer, slower]
37.mp3 | That's the whole course. Congratulations on finishing every lesson!
38.mp3 | Finishing is not certification or permission to trade. Keep practising in demo mode.
