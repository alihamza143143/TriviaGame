// Game Data constants ported from logic

export interface Tile {
  id: number;
  label: string;
  type: "start" | "trivia" | "decision" | "invest" | "risk";
}

export interface Question {
  topic: string;
  q: string;
  a: string[];
  correct: number;
  exp: string;
}

export type Tier = "kids" | "teens" | "adults";

export const TILES: Tile[] = [
  { id: 1,  label: "Start: Payday", type: "start" },
  { id: 2,  label: "Budget Basics", type: "trivia" },
  { id: 3,  label: "Start a Business", type: "decision" },
  { id: 4,  label: "High-Yield Savings", type: "trivia" },
  { id: 5,  label: "Real Estate Deal", type: "invest" },
  { id: 6,  label: "Bank Loan / Line of Credit", type: "decision" },
  { id: 7,  label: "Stocks / ETFs", type: "invest" },
  { id: 8,  label: "Crypto Volatility", type: "risk" },
  { id: 9,  label: "Foreclosure / Refinance / HELOC", type: "risk" },
  { id:10,  label: "Estate Planning / Trust", type: "trivia" },
  { id:11,  label: "Tax Liens / Tax Deeds", type: "trivia" },
  { id:12,  label: "Goal Setting & Review", type: "decision" },
];

export const QUESTIONS: Record<Tier, Question[]> = {
  kids: [
    {topic:"saving", q:"What does it mean to save money?", a:["Spend it now","Keep it for later","Throw it away"], correct:1, exp:"Saving means holding money for future needs or goals."},
    {topic:"budget", q:"A budget is a plan for your…", a:["Games","Money","Shoes"], correct:1, exp:"A budget helps you decide how to use money."},
    {topic:"banking", q:"Where can people keep money safe?", a:["A bank","A pizza box","A sidewalk"], correct:0, exp:"Banks are made for storing money safely."},
    {topic:"needswants", q:"Food is a…", a:["Need","Want","Toy"], correct:0, exp:"Needs are required to live."},
    {topic:"needswants", q:"A new video game is usually a…", a:["Need","Want","Rule"], correct:1, exp:"Wants are fun but not required."},
    {topic:"income", q:"Money you earn from work is called…", a:["Income","Dust","Candy"], correct:0, exp:"Income is money you receive for working."},
    {topic:"business", q:"A business makes money by…", a:["Helping people","Breaking things","Hiding"], correct:0, exp:"Businesses solve problems for customers."},
    {topic:"goals", q:"A good money goal should be…", a:["Clear","Secret","Impossible"], correct:0, exp:"Clear goals are easier to plan for."},
    {topic:"interest", q:"Interest is…", a:["Extra money added","A snack","A jacket"], correct:0, exp:"Interest can be earned on savings."},
    {topic:"hysa", q:"A high-yield savings account usually gives…", a:["More interest","Less interest","No interest"], correct:0, exp:"HYSA often pays higher interest than regular savings."},
    {topic:"spending", q:"Tracking spending means you…", a:["Forget purchases","Write down what you buy","Buy more"], correct:1, exp:"Tracking shows where your money goes."},
    {topic:"taxes", q:"Taxes are money paid to…", a:["Government","Cartoons","Pets"], correct:0, exp:"Taxes help pay for public services."},
    {topic:"stocks", q:"Buying a stock means you own a…", a:["Piece of a company","Piece of candy","Piece of paper only"], correct:0, exp:"A stock can represent ownership in a company."},
    {topic:"diversify", q:"Diversifying means…", a:["All money in one thing","Spreading money across choices","Never saving"], correct:1, exp:"Spreading out can reduce risk."},
    {topic:"crypto", q:"Crypto is a type of…", a:["Digital money","Homework","Food"], correct:0, exp:"Crypto is a digital asset people can buy/sell."},
    {topic:"scams", q:"A scam is when someone tries to…", a:["Help you","Trick you for money","Teach you"], correct:1, exp:"Scammers try to steal money or information."},
    {topic:"credit", q:"Credit means…", a:["Borrow now, pay later","Free money forever","No money"], correct:0, exp:"Credit lets you borrow and repay later."},
    {topic:"debt", q:"Debt is money you…", a:["Owe","Found","Threw away"], correct:0, exp:"Debt must be paid back."},
    {topic:"insurance", q:"Insurance helps you…", a:["Protect from big costs","Get candy","Win games"], correct:0, exp:"Insurance reduces financial risk."},
    {topic:"realestate", q:"Real estate usually means…", a:["Houses/land","Shoes","Phones"], correct:0, exp:"Real estate is property like land and homes."},
    {topic:"rent", q:"Rent is money you pay to…", a:["Live in a place you don’t own","Buy a toy","Get a snack"], correct:0, exp:"Rent is paid to use a home or apartment."},
    {topic:"mortgage", q:"A mortgage is a loan for a…", a:["House","Bicycle","Backpack"], correct:0, exp:"A mortgage helps buy a home."},
    {topic:"foreclosure", q:"Foreclosure can happen if you…", a:["Pay on time","Don’t pay the mortgage","Paint the house"], correct:1, exp:"Missing payments can cause foreclosure."},
    {topic:"goalsetting", q:"The first step to reaching a goal is to…", a:["Write it down","Forget it","Hide it"], correct:0, exp:"Writing goals makes them real."},
    {topic:"entrepreneurship", q:"An entrepreneur is someone who…", a:["Starts a business","Only plays games","Never works"], correct:0, exp:"Entrepreneurs build businesses."},
    {topic:"profit", q:"Profit is money left after…", a:["Expenses","Sleep","Homework"], correct:0, exp:"Profit = money in minus money out."},
    {topic:"expenses", q:"An expense is…", a:["Money you spend","Money you earn","A coupon"], correct:0, exp:"Expenses are costs you pay."},
    {topic:"cashflow", q:"Cash flow is about money…", a:["Coming in and going out","Staying hidden","Turning into candy"], correct:0, exp:"Cash flow tracks income and expenses."},
    {topic:"emergencyfund", q:"An emergency fund is for…", a:["Surprises","More toys always","Nothing"], correct:0, exp:"It helps during unexpected events."},
    {topic:"banking", q:"A checking account is used for…", a:["Everyday spending","Hiding money","Buying houses"], correct:0, exp:"Checking is for daily transactions."},
  ],

  teens: [
    {topic:"budget", q:"A budget mainly helps you…", a:["Control spending","Increase taxes","Avoid saving"], correct:0, exp:"A budget is a plan for income and expenses."},
    {topic:"hysa", q:"HYSA is best for money you want…", a:["Safe + earning interest","Locked for 30 years","To gamble"], correct:0, exp:"HYSA is for safer cash with interest."},
    {topic:"credit", q:"A credit score mostly measures your…", a:["Payment history & debt behavior","Height","Job title"], correct:0, exp:"Scores reflect how you handle borrowing."},
    {topic:"debt", q:"Interest on debt means you…", a:["Pay extra","Pay less","Pay nothing"], correct:0, exp:"Interest is the cost of borrowing."},
    {topic:"stocks", q:"Stocks usually grow by…", a:["Company performance","Magic","Luck only"], correct:0, exp:"Stocks depend on business results and markets."},
    {topic:"etf", q:"ETFs can help because they are…", a:["Diversified","Always risk-free","Only crypto"], correct:0, exp:"ETFs often hold many investments."},
    {topic:"mutualfunds", q:"Mutual funds are typically…", a:["Professionally managed pools","Lottery tickets","Bank loans"], correct:0, exp:"They pool money into a portfolio."},
    {topic:"crypto", q:"Crypto volatility means prices can…", a:["Swing quickly","Never change","Only go up"], correct:0, exp:"Volatility = fast price movement."},
    {topic:"risk", q:"Higher reward investments usually have…", a:["Higher risk","No risk","Guaranteed results"], correct:0, exp:"Risk and reward often rise together."},
    {topic:"banking", q:"A checking account is used for…", a:["Bills & daily spending","Long-term investing","Buying options"], correct:0, exp:"Checking supports transactions."},
  ],

  adults: [
    {topic:"estateplanning", q:"A trust can help reduce…", a:["Probate delays","Your income instantly","All taxes always"], correct:0, exp:"Trusts often streamline inheritance and control distribution."},
    {topic:"taxliens", q:"Tax lien investing often earns returns through…", a:["Interest/penalties paid by owner","Rent from tenants","Stock dividends"], correct:0, exp:"Lien investors may earn interest when taxes are repaid."},
    {topic:"taxdeeds", q:"A tax deed typically means the investor…", a:["Buys the property at tax sale","Buys an ETF","Gets a bank loan"], correct:0, exp:"Deeds can transfer ownership after tax sale rules."},
    {topic:"heloc", q:"A HELOC is a…", a:["Revolving credit line on home equity","Fixed-rate student loan","Checking account"], correct:0, exp:"HELOCs borrow against equity, often variable rate."},
    {topic:"refinance", q:"Refinancing can lower payments if…", a:["Rate/term improves after costs","You skip underwriting always","It’s free"], correct:0, exp:"Costs matter; compare breakeven time."},
    {topic:"options", q:"A call option gives the right to…", a:["Buy at a strike price","Sell at any price","Borrow from a bank"], correct:0, exp:"Calls = right to buy; puts = right to sell."},
    {topic:"options", q:"A put option gives the right to…", a:["Sell at a strike price","Buy at any price","Earn fixed interest"], correct:0, exp:"Puts are often used for hedging downside."},
    {topic:"insurance", q:"Term life insurance is generally for…", a:["Income replacement during key years","Guaranteed investment growth","Avoiding all taxes"], correct:0, exp:"Term is protection-focused, not an investment."},
    {topic:"business", q:"Healthy business cash flow means…", a:["Income exceeds expenses reliably","You have many logos","You avoid budgeting"], correct:0, exp:"Cash flow is oxygen for business survival."},
    {topic:"investing", q:"Diversification reduces…", a:["Concentration risk","All risk","All taxes"], correct:0, exp:"It helps reduce single-asset blowups."},
  ]
};

export interface DecisionChoice {
  label: string;
  cashDelta: number;
  passiveDelta: number;
  scoreDelta: number;
  explain: string;
  resultLine: (state: any) => string;
}

export interface Decision {
  prompt: string;
  choices: DecisionChoice[];
}

export function buildDecisionsByTile(tileId: number, tier: Tier): Decision {
  const money = (n: number) => `$${Math.abs(n).toLocaleString()}`;

  if(tileId === 3){
    return {
      prompt: "Starting a small business: what’s your move?",
      choices: [
        {
          label: "Start a simple service (low cost) - pay $120, learn customers",
          cashDelta: -120, passiveDelta: tier==="kids" ? 10 : 20, scoreDelta: 12,
          explain: "Low-cost businesses teach sales and can become repeat income.",
          resultLine: (state)=>`✅ You started small. Cash ${money(state.cash)}. Passive +${money(tier==="kids"?10:20)}.`
        },
        {
          label: "Buy expensive gear with no plan - pay $220",
          cashDelta: -220, passiveDelta: 0, scoreDelta: -6,
          explain: "Spending before validating demand can drain cash fast.",
          resultLine: (state)=>`❌ Costly lesson. Cash ${money(state.cash)}. Validate demand first.`
        },
        {
          label: "Do market research first (free) - gain strategy points",
          cashDelta: 0, passiveDelta: 0, scoreDelta: 8,
          explain: "Research reduces risk and improves future decisions.",
          resultLine: ()=>`✅ Smart move. You learned your market. Score +8.`
        }
      ]
    };
  }

  if(tileId === 6){
    return {
      prompt: "Banking: You need capital. What do you choose?",
      choices: [
        {
          label: "Apply for a small business loan (pay $60 fees, +$140 passive later)",
          cashDelta: -60, passiveDelta: tier==="kids" ? 10 : tier==="teens" ? 25 : 35, scoreDelta: 10,
          explain: "Debt can help if it funds revenue that exceeds the cost of borrowing.",
          resultLine: ()=>`✅ You used credit wisely. Passive income increased.`
        },
        {
          label: "Open a line of credit and spend it on wants (-$150)",
          cashDelta: -150, passiveDelta: 0, scoreDelta: -10,
          explain: "Using credit for non-productive spending creates stress and interest costs.",
          resultLine: ()=>`❌ Debt without returns hurts.`
        },
        {
          label: "Bootstrap: save first (free) + small bonus",
          cashDelta: 40, passiveDelta: 0, scoreDelta: 6,
          explain: "Saving builds a buffer and reduces reliance on debt.",
          resultLine: ()=>`✅ You boosted your savings discipline. +$40 cash.`
        }
      ]
    };
  }

  if(tileId === 12){
    return {
      prompt: "Goal Setting: Pick a wealth plan for the next 3 turns.",
      choices: [
        {
          label: "Auto-save + invest (pay $80 now, +$40 passive)",
          cashDelta: -80, passiveDelta: tier==="kids"?15: tier==="teens"?30:40, scoreDelta: 12,
          explain: "Automating good behavior is a powerful wealth habit.",
          resultLine: ()=>`✅ Automation activated. Passive income rose.`
        },
        {
          label: "No plan (do nothing)",
          cashDelta: 0, passiveDelta: 0, scoreDelta: -2,
          explain: "Without goals, money drifts into spending.",
          resultLine: ()=>`⚠️ No plan. Try setting a clear target next time.`
        },
        {
          label: "Increase income: side hustle sprint (+$120 cash, -$10 passive)",
          cashDelta: 120, passiveDelta: -10, scoreDelta: 6,
          explain: "Active income is great, but passive is what wins long term.",
          resultLine: ()=>`✅ Great hustle. Consider rebuilding passive income next.`
        }
      ]
    };
  }

  // default
  return {
    prompt: "Decision: Choose a smart money move.",
    choices: [
      {
        label: "Save 10% ( +$30 cash buffer )",
        cashDelta: 30, passiveDelta: 0, scoreDelta: 5,
        explain: "Small buffers prevent big problems.",
        resultLine: ()=>`✅ Buffer built.`
      },
      {
        label: "Invest for the long term ( -$50 cash, +$20 passive )",
        cashDelta: -50, passiveDelta: 20, scoreDelta: 10,
        explain: "Investing grows wealth over time.",
        resultLine: ()=>`✅ Long-term investing increased passive income.`
      },
      {
        label: "Impulse spend ( -$70 )",
        cashDelta: -70, passiveDelta: 0, scoreDelta: -6,
        explain: "Impulse spending delays goals.",
        resultLine: ()=>`❌ Ouch. Try a spending plan.`
      }
    ]
  };
}
