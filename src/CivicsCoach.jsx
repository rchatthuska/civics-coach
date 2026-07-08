import React, { useState, useEffect, useRef, useCallback } from "react";

/* ============ 2025 USCIS Civics Test — 128 Questions ============
   q = question, a = official answers (display), k = keyword matchers,
   r = distinct keywords required (default 1), v = emoji visual, c = caption */
const Q = [
  {
    n: 1,
    q: "What is the form of government of the United States?",
    a: [
      "Republic",
      "Constitution-based federal republic",
      "Representative democracy",
    ],
    k: ["republic", "representative democracy"],
    v: "🏛️",
    c: "The U.S. Capitol — seat of the republic",
  },
  {
    n: 2,
    q: "What is the supreme law of the land?",
    a: ["(U.S.) Constitution"],
    k: ["constitution"],
    v: "📜",
    c: "The U.S. Constitution, signed 1787",
  },
  {
    n: 3,
    q: "Name one thing the U.S. Constitution does.",
    a: [
      "Forms the government",
      "Defines powers of government",
      "Defines the parts of government",
      "Protects the rights of the people",
    ],
    k: [
      "forms the government",
      "defines",
      "protects the rights",
      "rights of the people",
    ],
    v: "⚖️",
    c: "A framework of powers and rights",
  },
  {
    n: 4,
    q: 'The U.S. Constitution starts with the words "We the People." What does "We the People" mean?',
    a: [
      "Self-government",
      "Popular sovereignty",
      "Consent of the governed",
      "People should govern themselves",
      "(Example of) social contract",
    ],
    k: [
      "self government",
      "popular sovereignty",
      "consent of the governed",
      "govern themselves",
      "social contract",
    ],
    v: "🗳️",
    c: '"We the People" — power comes from citizens',
  },
  {
    n: 5,
    q: "How are changes made to the U.S. Constitution?",
    a: ["Amendments", "The amendment process"],
    k: ["amendment"],
    v: "📝",
    c: "27 amendments so far",
  },
  {
    n: 6,
    q: "What does the Bill of Rights protect?",
    a: [
      "(The basic) rights of Americans",
      "(The basic) rights of people living in the United States",
    ],
    k: ["rights"],
    v: "✊",
    c: "The first 10 amendments",
  },
  {
    n: 7,
    q: "How many amendments does the U.S. Constitution have?",
    a: ["Twenty-seven (27)"],
    k: ["27", "twenty seven"],
    v: "✍️",
    c: "27 amendments",
  },
  {
    n: 8,
    q: "Why is the Declaration of Independence important?",
    a: [
      "It says America is free from British control.",
      "It says all people are created equal.",
      "It identifies inherent rights.",
      "It identifies individual freedoms.",
    ],
    k: [
      "free from british",
      "created equal",
      "inherent rights",
      "individual freedoms",
    ],
    v: "🗽",
    c: "Liberty declared, July 1776",
  },
  {
    n: 9,
    q: "What founding document said the American colonies were free from Britain?",
    a: ["Declaration of Independence"],
    k: ["declaration of independence", "declaration"],
    v: "📜",
    c: "The Declaration of Independence",
  },
  {
    n: 10,
    q: "Name two important ideas from the Declaration of Independence and the U.S. Constitution.",
    a: [
      "Equality",
      "Liberty",
      "Social contract",
      "Natural rights",
      "Limited government",
      "Self-government",
    ],
    k: [
      "equality",
      "liberty",
      "social contract",
      "natural rights",
      "limited government",
      "self government",
    ],
    r: 2,
    v: "💡",
    c: "Equality, liberty, natural rights",
  },
  {
    n: 11,
    q: 'The words "Life, Liberty, and the pursuit of Happiness" are in what founding document?',
    a: ["Declaration of Independence"],
    k: ["declaration"],
    v: "🕊️",
    c: "Jefferson's famous phrase",
  },
  {
    n: 12,
    q: "What is the economic system of the United States?",
    a: ["Capitalism", "Free market economy"],
    k: ["capitalism", "free market"],
    v: "💵",
    c: "A free-market economy",
  },
  {
    n: 13,
    q: "What is the rule of law?",
    a: [
      "Everyone must follow the law.",
      "Leaders must obey the law.",
      "Government must obey the law.",
      "No one is above the law.",
    ],
    k: ["follow the law", "obey the law", "above the law"],
    v: "⚖️",
    c: "No one is above the law",
  },
  {
    n: 14,
    q: "Many documents influenced the U.S. Constitution. Name one.",
    a: [
      "Declaration of Independence",
      "Articles of Confederation",
      "Federalist Papers",
      "Anti-Federalist Papers",
      "Virginia Declaration of Rights",
      "Fundamental Orders of Connecticut",
      "Mayflower Compact",
      "Iroquois Great Law of Peace",
    ],
    k: [
      "declaration",
      "articles of confederation",
      "federalist",
      "virginia declaration",
      "fundamental orders",
      "mayflower",
      "iroquois",
    ],
    v: "📚",
    c: "Documents that shaped the Constitution",
  },
  {
    n: 15,
    q: "There are three branches of government. Why?",
    a: [
      "So one part does not become too powerful",
      "Checks and balances",
      "Separation of powers",
    ],
    k: ["too powerful", "checks and balances", "separation of powers"],
    v: "🔱",
    c: "Checks and balances",
  },
  {
    n: 16,
    q: "Name the three branches of government.",
    a: [
      "Legislative, executive, and judicial",
      "Congress, president, and the courts",
    ],
    k: [
      "legislative",
      "executive",
      "judicial",
      "congress",
      "president",
      "court",
    ],
    r: 3,
    v: "🏛️",
    c: "Legislative • Executive • Judicial",
  },
  {
    n: 17,
    q: "The President of the United States is in charge of which branch of government?",
    a: ["Executive branch"],
    k: ["executive"],
    v: "🇺🇸",
    c: "The executive branch",
  },
  {
    n: 18,
    q: "What part of the federal government writes laws?",
    a: [
      "(U.S.) Congress",
      "(U.S. or national) legislature",
      "Legislative branch",
    ],
    k: ["congress", "legislature", "legislative"],
    v: "🏛️",
    c: "Congress writes the laws",
  },
  {
    n: 19,
    q: "What are the two parts of the U.S. Congress?",
    a: ["Senate and House (of Representatives)"],
    k: ["senate", "house"],
    r: 2,
    v: "🏢",
    c: "Senate + House of Representatives",
  },
  {
    n: 20,
    q: "Name one power of the U.S. Congress.",
    a: ["Writes laws", "Declares war", "Makes the federal budget"],
    k: ["laws", "declare", "war", "budget"],
    v: "📋",
    c: "Laws, war, and the budget",
  },
  {
    n: 21,
    q: "How many U.S. senators are there?",
    a: ["One hundred (100)"],
    k: ["100", "one hundred", "hundred"],
    v: "💯",
    c: "100 senators — 2 per state",
  },
  {
    n: 22,
    q: "How long is a term for a U.S. senator?",
    a: ["Six (6) years"],
    k: ["six", "6"],
    v: "⏳",
    c: "Six-year terms",
  },
  {
    n: 23,
    q: "Who is one of your state's U.S. senators now?",
    a: [
      "Chuck Schumer",
      "Kirsten Gillibrand",
      "(Answers vary by state — these are New York's)",
    ],
    k: ["schumer", "gillibrand"],
    v: "🗽",
    c: "New York's senators (verify before your interview)",
  },
  {
    n: 24,
    q: "How many voting members are in the House of Representatives?",
    a: ["Four hundred thirty-five (435)"],
    k: ["435", "four hundred thirty five"],
    v: "🏢",
    c: "435 voting members",
  },
  {
    n: 25,
    q: "How long is a term for a member of the House of Representatives?",
    a: ["Two (2) years"],
    k: ["two", "2"],
    v: "⏱️",
    c: "Two-year terms",
  },
  {
    n: 26,
    q: "Why do U.S. representatives serve shorter terms than U.S. senators?",
    a: ["To more closely follow public opinion"],
    k: ["public opinion", "closely follow"],
    v: "📣",
    c: "Staying close to public opinion",
  },
  {
    n: 27,
    q: "How many senators does each state have?",
    a: ["Two (2)"],
    k: ["two", "2"],
    v: "✌️",
    c: "Two per state",
  },
  {
    n: 28,
    q: "Why does each state have two senators?",
    a: [
      "Equal representation (for small states)",
      "The Great Compromise (Connecticut Compromise)",
    ],
    k: ["equal representation", "great compromise", "connecticut compromise"],
    v: "🤝",
    c: "The Great Compromise of 1787",
  },
  {
    n: 29,
    q: "Name your U.S. representative.",
    a: ["Joe Morelle (NY-25, Rochester area)", "(Answers vary by district)"],
    k: ["morelle"],
    v: "🏙️",
    c: "Rochester is NY's 25th district (verify yours)",
  },
  {
    n: 30,
    q: "What is the name of the Speaker of the House of Representatives now?",
    a: ["Mike Johnson (verify at uscis.gov/citizenship/testupdates)"],
    k: ["johnson"],
    v: "🔨",
    c: "Speaker of the House (check for updates)",
  },
  {
    n: 31,
    q: "Who does a U.S. senator represent?",
    a: ["Citizens of their state", "People of their state"],
    k: ["state"],
    v: "🗺️",
    c: "All the people of their state",
  },
  {
    n: 32,
    q: "Who elects U.S. senators?",
    a: ["Citizens from their state"],
    k: ["citizens", "state"],
    v: "🗳️",
    c: "Citizens of the state",
  },
  {
    n: 33,
    q: "Who does a member of the House of Representatives represent?",
    a: [
      "Citizens in their (congressional) district",
      "People in their district",
    ],
    k: ["district"],
    v: "📍",
    c: "Their congressional district",
  },
  {
    n: 34,
    q: "Who elects members of the House of Representatives?",
    a: ["Citizens from their (congressional) district"],
    k: ["citizens", "district"],
    v: "🗳️",
    c: "Citizens of the district",
  },
  {
    n: 35,
    q: "Some states have more representatives than other states. Why?",
    a: [
      "(Because of) the state's population",
      "(Because) they have more people",
    ],
    k: ["population", "more people"],
    v: "👥",
    c: "Representation follows population",
  },
  {
    n: 36,
    q: "The President of the United States is elected for how many years?",
    a: ["Four (4) years"],
    k: ["four", "4"],
    v: "🗓️",
    c: "Four-year terms",
  },
  {
    n: 37,
    q: "The President of the United States can serve only two terms. Why?",
    a: [
      "(Because of) the 22nd Amendment",
      "To keep the president from becoming too powerful",
    ],
    k: ["22nd", "22", "twenty second", "too powerful"],
    v: "🚫",
    c: "The 22nd Amendment",
  },
  {
    n: 38,
    q: "What is the name of the President of the United States now?",
    a: ["Donald Trump (verify at uscis.gov/citizenship/testupdates)"],
    k: ["trump"],
    v: "🇺🇸",
    c: "The current president (check for updates)",
  },
  {
    n: 39,
    q: "What is the name of the Vice President of the United States now?",
    a: ["JD Vance (verify at uscis.gov/citizenship/testupdates)"],
    k: ["vance"],
    v: "🇺🇸",
    c: "The current vice president (check for updates)",
  },
  {
    n: 40,
    q: "If the president can no longer serve, who becomes president?",
    a: ["The Vice President (of the United States)"],
    k: ["vice president"],
    v: "➡️",
    c: "The line of succession",
  },
  {
    n: 41,
    q: "Name one power of the president.",
    a: [
      "Signs bills into law",
      "Vetoes bills",
      "Enforces laws",
      "Commander in Chief (of the military)",
      "Chief diplomat",
      "Appoints federal judges",
    ],
    k: [
      "signs bills",
      "veto",
      "enforce",
      "commander in chief",
      "diplomat",
      "appoints",
    ],
    v: "🖋️",
    c: "Sign, veto, enforce, command",
  },
  {
    n: 42,
    q: "Who is Commander in Chief of the U.S. military?",
    a: ["The President (of the United States)"],
    k: ["president"],
    v: "🎖️",
    c: "The president commands the military",
  },
  {
    n: 43,
    q: "Who signs bills to become laws?",
    a: ["The President (of the United States)"],
    k: ["president"],
    v: "🖋️",
    c: "A bill becomes law with a signature",
  },
  {
    n: 44,
    q: "Who vetoes bills?",
    a: ["The President (of the United States)"],
    k: ["president"],
    v: "🛑",
    c: "The presidential veto",
  },
  {
    n: 45,
    q: "Who appoints federal judges?",
    a: ["The President (of the United States)"],
    k: ["president"],
    v: "👨‍⚖️",
    c: "Appointed by the president",
  },
  {
    n: 46,
    q: "The executive branch has many parts. Name one.",
    a: [
      "President (of the United States)",
      "Cabinet",
      "Federal departments and agencies",
    ],
    k: ["president", "cabinet", "departments", "agencies"],
    v: "🏢",
    c: "President, Cabinet, and agencies",
  },
  {
    n: 47,
    q: "What does the President's Cabinet do?",
    a: ["Advises the President (of the United States)"],
    k: ["advise"],
    v: "💼",
    c: "The Cabinet advises the president",
  },
  {
    n: 48,
    q: "What are two Cabinet-level positions?",
    a: [
      "Attorney General",
      "Secretary of State",
      "Secretary of the Treasury",
      "Secretary of Defense (War)",
      "Secretary of Labor",
      "Vice-President",
      "...and others",
    ],
    k: [
      "attorney general",
      "agriculture",
      "commerce",
      "education",
      "energy",
      "health",
      "homeland",
      "housing",
      "interior",
      "labor",
      "secretary of state",
      "transportation",
      "treasury",
      "veterans",
      "defense",
      "war",
      "vice president",
      "environmental",
      "small business",
      "central intelligence",
      "management and budget",
      "national intelligence",
      "trade representative",
    ],
    r: 2,
    v: "🗂️",
    c: "The president's Cabinet",
  },
  {
    n: 49,
    q: "Why is the Electoral College important?",
    a: [
      "It decides who is elected president.",
      "It provides a compromise between popular election and congressional selection.",
    ],
    k: ["decides", "elected president", "compromise"],
    v: "🗳️",
    c: "How presidents are chosen",
  },
  {
    n: 50,
    q: "What is one part of the judicial branch?",
    a: ["Supreme Court", "Federal Courts"],
    k: ["supreme court", "federal courts"],
    v: "⚖️",
    c: "The federal courts",
  },
  {
    n: 51,
    q: "What does the judicial branch do?",
    a: [
      "Reviews laws",
      "Explains laws",
      "Resolves disputes about the law",
      "Decides if a law goes against the Constitution",
    ],
    k: [
      "review",
      "explain",
      "disputes",
      "against the constitution",
      "constitution",
    ],
    v: "🔍",
    c: "Reviewing and explaining the law",
  },
  {
    n: 52,
    q: "What is the highest court in the United States?",
    a: ["Supreme Court"],
    k: ["supreme court"],
    v: "🏛️",
    c: "The Supreme Court building",
  },
  {
    n: 53,
    q: "How many seats are on the Supreme Court?",
    a: ["Nine (9)"],
    k: ["nine", "9"],
    v: "9️⃣",
    c: "Nine justices",
  },
  {
    n: 54,
    q: "How many Supreme Court justices are usually needed to decide a case?",
    a: ["Five (5)"],
    k: ["five", "5"],
    v: "5️⃣",
    c: "A five-justice majority",
  },
  {
    n: 55,
    q: "How long do Supreme Court justices serve?",
    a: ["(For) life", "Lifetime appointment", "(Until) retirement"],
    k: ["life", "retirement"],
    v: "♾️",
    c: "Lifetime appointments",
  },
  {
    n: 56,
    q: "Supreme Court justices serve for life. Why?",
    a: [
      "To be independent (of politics)",
      "To limit outside (political) influence",
    ],
    k: ["independent", "political influence", "politics"],
    v: "🛡️",
    c: "Independence from politics",
  },
  {
    n: 57,
    q: "Who is the Chief Justice of the United States now?",
    a: ["John Roberts (verify at uscis.gov/citizenship/testupdates)"],
    k: ["roberts"],
    v: "👨‍⚖️",
    c: "The Chief Justice (check for updates)",
  },
  {
    n: 58,
    q: "Name one power that is only for the federal government.",
    a: [
      "Print paper money",
      "Mint coins",
      "Declare war",
      "Create an army",
      "Make treaties",
      "Set foreign policy",
    ],
    k: ["print", "mint", "declare war", "army", "treaties", "foreign policy"],
    v: "💰",
    c: "Money, war, treaties",
  },
  {
    n: 59,
    q: "Name one power that is only for the states.",
    a: [
      "Provide schooling and education",
      "Provide protection (police)",
      "Provide safety (fire departments)",
      "Give a driver's license",
      "Approve zoning and land use",
    ],
    k: [
      "school",
      "education",
      "police",
      "fire",
      "driver",
      "zoning",
      "land use",
    ],
    v: "🚸",
    c: "Schools, police, licenses",
  },
  {
    n: 60,
    q: "What is the purpose of the 10th Amendment?",
    a: [
      "Powers not given to the federal government belong to the states or to the people.",
    ],
    k: ["states", "people", "not given"],
    v: "🔟",
    c: "Powers reserved to the states",
  },
  {
    n: 61,
    q: "Who is the governor of your state now?",
    a: ["Kathy Hochul (New York — verify before your interview)"],
    k: ["hochul"],
    v: "🗽",
    c: "New York's governor (check for updates)",
  },
  {
    n: 62,
    q: "What is the capital of your state?",
    a: ["Albany (New York)"],
    k: ["albany"],
    v: "🏙️",
    c: "Albany, NY — the state capital",
  },
  {
    n: 63,
    q: "There are four amendments to the U.S. Constitution about who can vote. Describe one of them.",
    a: [
      "Citizens eighteen (18) and older can vote.",
      "You don't have to pay a poll tax to vote.",
      "Any citizen can vote (women and men).",
      "A male citizen of any race can vote.",
    ],
    k: ["18", "eighteen", "poll tax", "any citizen", "women", "race"],
    v: "🗳️",
    c: "Voting rights amendments",
  },
  {
    n: 64,
    q: "Who can vote in federal elections, run for federal office, and serve on a jury in the United States?",
    a: ["Citizens", "Citizens of the United States", "U.S. citizens"],
    k: ["citizens"],
    v: "🇺🇸",
    c: "Rights of citizenship",
  },
  {
    n: 65,
    q: "What are three rights of everyone living in the United States?",
    a: [
      "Freedom of expression",
      "Freedom of speech",
      "Freedom of assembly",
      "Freedom to petition the government",
      "Freedom of religion",
      "The right to bear arms",
    ],
    k: [
      "expression",
      "speech",
      "assembly",
      "petition",
      "religion",
      "bear arms",
    ],
    r: 3,
    v: "🗣️",
    c: "First Amendment freedoms",
  },
  {
    n: 66,
    q: "What do we show loyalty to when we say the Pledge of Allegiance?",
    a: ["The United States", "The flag"],
    k: ["united states", "flag"],
    v: "🇺🇸",
    c: "The Stars and Stripes",
  },
  {
    n: 67,
    q: "Name two promises that new citizens make in the Oath of Allegiance.",
    a: [
      "Give up loyalty to other countries",
      "Defend the (U.S.) Constitution",
      "Obey the laws of the United States",
      "Serve in the military (if needed)",
      "Serve the nation (if needed)",
      "Be loyal to the United States",
    ],
    k: [
      "give up",
      "defend",
      "obey",
      "military",
      "serve",
      "loyal to the united states",
    ],
    r: 2,
    v: "🤚",
    c: "The naturalization Oath ceremony",
  },
  {
    n: 68,
    q: "How can people become United States citizens?",
    a: [
      "Be born in the United States (14th Amendment)",
      "Naturalize",
      "Derive citizenship",
    ],
    k: ["born", "naturalize", "derive"],
    v: "📄",
    c: "Paths to citizenship",
  },
  {
    n: 69,
    q: "What are two examples of civic participation in the United States?",
    a: [
      "Vote",
      "Run for office",
      "Join a political party",
      "Help with a campaign",
      "Join a civic or community group",
      "Contact elected officials",
      "Support or oppose an issue",
      "Write to a newspaper",
    ],
    k: [
      "vote",
      "run for office",
      "political party",
      "campaign",
      "civic group",
      "community group",
      "opinion",
      "contact",
      "support",
      "oppose",
      "newspaper",
    ],
    r: 2,
    v: "📢",
    c: "Getting involved",
  },
  {
    n: 70,
    q: "What is one way Americans can serve their country?",
    a: [
      "Vote",
      "Pay taxes",
      "Obey the law",
      "Serve in the military",
      "Run for office",
      "Work for local, state, or federal government",
    ],
    k: ["vote", "taxes", "obey", "military", "run for office", "work for"],
    v: "🫡",
    c: "Ways to serve",
  },
  {
    n: 71,
    q: "Why is it important to pay federal taxes?",
    a: [
      "Required by law",
      "All people pay to fund the federal government",
      "Required by the Constitution (16th Amendment)",
      "Civic duty",
    ],
    k: ["required by law", "fund", "16th", "civic duty"],
    v: "🧾",
    c: "Taxes fund the government",
  },
  {
    n: 72,
    q: "It is important for all men age 18 through 25 to register for the Selective Service. Name one reason why.",
    a: ["Required by law", "Civic duty", "Makes the draft fair, if needed"],
    k: ["required by law", "civic duty", "draft"],
    v: "📋",
    c: "Selective Service registration",
  },
  {
    n: 73,
    q: "The colonists came to America for many reasons. Name one.",
    a: [
      "Freedom",
      "Political liberty",
      "Religious freedom",
      "Economic opportunity",
      "Escape persecution",
    ],
    k: ["freedom", "liberty", "religious", "economic", "persecution"],
    v: "⛵",
    c: "Colonists crossing the Atlantic",
  },
  {
    n: 74,
    q: "Who lived in America before the Europeans arrived?",
    a: ["American Indians", "Native Americans"],
    k: ["american indians", "native americans", "native"],
    v: "🪶",
    c: "Native peoples of America",
  },
  {
    n: 75,
    q: "What group of people was taken and sold as slaves?",
    a: ["Africans", "People from Africa"],
    k: ["africa"],
    v: "⛓️",
    c: "The Atlantic slave trade",
  },
  {
    n: 76,
    q: "What war did the Americans fight to win independence from Britain?",
    a: [
      "American Revolution",
      "The (American) Revolutionary War",
      "War for (American) Independence",
    ],
    k: ["revolution", "independence"],
    v: "🎪",
    c: "The American Revolution, 1775–1783",
  },
  {
    n: 77,
    q: "Name one reason why the Americans declared independence from Britain.",
    a: [
      "High taxes",
      "Taxation without representation",
      "Quartering of British soldiers",
      "No self-government",
      "Boston Massacre",
      "Boston Tea Party",
      "Stamp Act",
      "Sugar Act",
      "Townshend Acts",
      "Intolerable Acts",
    ],
    k: [
      "taxes",
      "taxation",
      "quartering",
      "boarding",
      "self government",
      "massacre",
      "tea",
      "stamp",
      "sugar",
      "townshend",
      "intolerable",
      "coercive",
    ],
    v: "🍵",
    c: "The Boston Tea Party, 1773",
  },
  {
    n: 78,
    q: "Who wrote the Declaration of Independence?",
    a: ["(Thomas) Jefferson"],
    k: ["jefferson"],
    v: "🖋️",
    c: "Thomas Jefferson",
  },
  {
    n: 79,
    q: "When was the Declaration of Independence adopted?",
    a: ["July 4, 1776"],
    k: ["1776", "july 4"],
    v: "🎆",
    c: "July 4, 1776",
  },
  {
    n: 80,
    q: "The American Revolution had many important events. Name one.",
    a: [
      "(Battle of) Bunker Hill",
      "Declaration of Independence",
      "Washington Crossing the Delaware (Trenton)",
      "(Battle of) Saratoga",
      "Valley Forge",
      "(Battle of) Yorktown",
    ],
    k: [
      "bunker hill",
      "declaration",
      "delaware",
      "trenton",
      "saratoga",
      "valley forge",
      "yorktown",
    ],
    v: "🛶",
    c: "Washington crossing the Delaware",
  },
  {
    n: 81,
    q: "There were 13 original states. Name five.",
    a: [
      "New Hampshire",
      "Massachusetts",
      "Rhode Island",
      "Connecticut",
      "New York",
      "New Jersey",
      "Pennsylvania",
      "Delaware",
      "Maryland",
      "Virginia",
      "North Carolina",
      "South Carolina",
      "Georgia",
    ],
    k: [
      "new hampshire",
      "massachusetts",
      "rhode island",
      "connecticut",
      "new york",
      "new jersey",
      "pennsylvania",
      "delaware",
      "maryland",
      "virginia",
      "north carolina",
      "south carolina",
      "georgia",
    ],
    r: 5,
    v: "1️⃣3️⃣",
    c: "The 13 original colonies",
  },
  {
    n: 82,
    q: "What founding document was written in 1787?",
    a: ["(U.S.) Constitution"],
    k: ["constitution"],
    v: "📜",
    c: "The Constitutional Convention, 1787",
  },
  {
    n: 83,
    q: "The Federalist Papers supported the passage of the U.S. Constitution. Name one of the writers.",
    a: ["(James) Madison", "(Alexander) Hamilton", "(John) Jay", "Publius"],
    k: ["madison", "hamilton", "jay", "publius"],
    v: "📰",
    c: "Madison, Hamilton, and Jay",
  },
  {
    n: 84,
    q: "Why were the Federalist Papers important?",
    a: [
      "They helped people understand the Constitution.",
      "They supported passing the Constitution.",
    ],
    k: ["understand", "support"],
    v: "📖",
    c: "Essays for ratification",
  },
  {
    n: 85,
    q: "Benjamin Franklin is famous for many things. Name one.",
    a: [
      "Founded the first free public libraries",
      "First Postmaster General",
      "Helped write the Declaration of Independence",
      "Inventor",
      "U.S. diplomat",
    ],
    k: ["libraries", "postmaster", "declaration", "inventor", "diplomat"],
    v: "🪁",
    c: "Franklin — printer, inventor, diplomat",
  },
  {
    n: 86,
    q: "George Washington is famous for many things. Name one.",
    a: [
      '"Father of Our Country"',
      "First president of the United States",
      "General of the Continental Army",
      "President of the Constitutional Convention",
    ],
    k: [
      "father of our country",
      "first president",
      "continental army",
      "constitutional convention",
    ],
    v: "🇺🇸",
    c: "George Washington, first president",
  },
  {
    n: 87,
    q: "Thomas Jefferson is famous for many things. Name one.",
    a: [
      "Writer of the Declaration of Independence",
      "Third president",
      "Doubled the size of the U.S. (Louisiana Purchase)",
      "First Secretary of State",
      "Founded the University of Virginia",
    ],
    k: [
      "declaration",
      "third president",
      "louisiana",
      "secretary of state",
      "university of virginia",
      "religious freedom",
    ],
    v: "🖋️",
    c: "Jefferson at Monticello",
  },
  {
    n: 88,
    q: "James Madison is famous for many things. Name one.",
    a: [
      '"Father of the Constitution"',
      "Fourth president",
      "President during the War of 1812",
      "One of the writers of the Federalist Papers",
    ],
    k: ["father of the constitution", "fourth president", "1812", "federalist"],
    v: "📜",
    c: "Madison, Father of the Constitution",
  },
  {
    n: 89,
    q: "Alexander Hamilton is famous for many things. Name one.",
    a: [
      "First Secretary of the Treasury",
      "Writer of the Federalist Papers",
      "Helped establish the First Bank of the U.S.",
      "Aide to General Washington",
      "Member of the Continental Congress",
    ],
    k: ["treasury", "federalist", "first bank", "aide", "continental congress"],
    v: "🏦",
    c: "Hamilton, first Treasury Secretary",
  },
  {
    n: 90,
    q: "What territory did the United States buy from France in 1803?",
    a: ["Louisiana Territory", "Louisiana"],
    k: ["louisiana"],
    v: "🗺️",
    c: "The Louisiana Purchase, 1803",
  },
  {
    n: 91,
    q: "Name one war fought by the United States in the 1800s.",
    a: [
      "War of 1812",
      "Mexican-American War",
      "Civil War",
      "Spanish-American War",
    ],
    k: ["1812", "mexican", "civil war", "spanish"],
    v: "⚔️",
    c: "Wars of the 1800s",
  },
  {
    n: 92,
    q: "Name the U.S. war between the North and the South.",
    a: ["The Civil War"],
    k: ["civil war"],
    v: "🎗️",
    c: "The Civil War, 1861–1865",
  },
  {
    n: 93,
    q: "The Civil War had many important events. Name one.",
    a: [
      "(Battle of) Fort Sumter",
      "Emancipation Proclamation",
      "(Battle of) Vicksburg",
      "(Battle of) Gettysburg",
      "Sherman's March",
      "(Surrender at) Appomattox",
      "(Battle of) Antietam",
      "Lincoln was assassinated.",
    ],
    k: [
      "sumter",
      "emancipation",
      "vicksburg",
      "gettysburg",
      "sherman",
      "appomattox",
      "antietam",
      "sharpsburg",
      "lincoln",
    ],
    v: "🕯️",
    c: "Gettysburg, 1863",
  },
  {
    n: 94,
    q: "Abraham Lincoln is famous for many things. Name one.",
    a: [
      "Freed the slaves (Emancipation Proclamation)",
      "Saved (preserved) the Union",
      "Led the U.S. during the Civil War",
      "16th president",
      "Delivered the Gettysburg Address",
    ],
    k: [
      "freed the slaves",
      "emancipation",
      "union",
      "civil war",
      "16th president",
      "gettysburg",
    ],
    v: "🎩",
    c: "Abraham Lincoln, 16th president",
  },
  {
    n: 95,
    q: "What did the Emancipation Proclamation do?",
    a: [
      "Freed the slaves",
      "Freed slaves in the Confederacy",
      "Freed slaves in the Confederate states",
    ],
    k: ["freed", "slaves"],
    v: "📜",
    c: "The Emancipation Proclamation, 1863",
  },
  {
    n: 96,
    q: "What U.S. war ended slavery?",
    a: ["The Civil War"],
    k: ["civil war"],
    v: "🕊️",
    c: "Slavery ended with the Civil War",
  },
  {
    n: 97,
    q: "What amendment says all persons born or naturalized in the United States, and subject to the jurisdiction thereof, are U.S. citizens?",
    a: ["14th Amendment"],
    k: ["14th", "14", "fourteenth"],
    v: "📄",
    c: "The 14th Amendment",
  },
  {
    n: 98,
    q: "When did all men get the right to vote?",
    a: [
      "After the Civil War",
      "During Reconstruction",
      "(With the) 15th Amendment",
      "1870",
    ],
    k: [
      "after the civil war",
      "reconstruction",
      "15th",
      "15",
      "fifteenth",
      "1870",
    ],
    v: "🗳️",
    c: "The 15th Amendment, 1870",
  },
  {
    n: 99,
    q: "Name one leader of the women's rights movement in the 1800s.",
    a: [
      "Susan B. Anthony",
      "Elizabeth Cady Stanton",
      "Sojourner Truth",
      "Harriet Tubman",
      "Lucretia Mott",
      "Lucy Stone",
    ],
    k: ["anthony", "stanton", "sojourner", "tubman", "mott", "lucy stone"],
    v: "♀️",
    c: "Susan B. Anthony — a Rochester icon",
  },
  {
    n: 100,
    q: "Name one war fought by the United States in the 1900s.",
    a: [
      "World War I",
      "World War II",
      "Korean War",
      "Vietnam War",
      "(Persian) Gulf War",
    ],
    k: ["world war", "korean", "vietnam", "gulf"],
    v: "🌍",
    c: "Wars of the 1900s",
  },
  {
    n: 101,
    q: "Why did the United States enter World War I?",
    a: [
      "Because Germany attacked U.S. (civilian) ships",
      "To support the Allied Powers",
      "To oppose the Central Powers",
    ],
    k: ["ships", "allied", "central"],
    v: "🚢",
    c: "U.S. ships attacked, 1917",
  },
  {
    n: 102,
    q: "When did all women get the right to vote?",
    a: ["1920", "After World War I", "(With the) 19th Amendment"],
    k: ["1920", "19th", "19", "nineteenth", "after world war"],
    v: "🗳️",
    c: "The 19th Amendment, 1920",
  },
  {
    n: 103,
    q: "What was the Great Depression?",
    a: ["Longest economic recession in modern history"],
    k: ["recession", "longest"],
    v: "📉",
    c: "Breadlines of the 1930s",
  },
  {
    n: 104,
    q: "When did the Great Depression start?",
    a: ["The Great Crash (1929)", "Stock market crash of 1929"],
    k: ["1929", "crash"],
    v: "💥",
    c: "The Crash of 1929",
  },
  {
    n: 105,
    q: "Who was president during the Great Depression and World War II?",
    a: ["(Franklin) Roosevelt"],
    k: ["roosevelt"],
    v: "🎙️",
    c: "FDR's fireside chats",
  },
  {
    n: 106,
    q: "Why did the United States enter World War II?",
    a: [
      "(Bombing of) Pearl Harbor",
      "Japanese attacked Pearl Harbor",
      "To support the Allied Powers",
      "To oppose the Axis Powers",
    ],
    k: ["pearl harbor", "allied", "axis", "japan"],
    v: "⚓",
    c: "Pearl Harbor, December 7, 1941",
  },
  {
    n: 107,
    q: "Dwight Eisenhower is famous for many things. Name one.",
    a: [
      "General during World War II",
      "President at the end of the Korean War",
      "34th president",
      "Signed the Federal-Aid Highway Act of 1956",
    ],
    k: ["general", "korean", "34th", "highway", "interstate"],
    v: "🛣️",
    c: "Eisenhower and the Interstate System",
  },
  {
    n: 108,
    q: "Who was the United States' main rival during the Cold War?",
    a: ["Soviet Union", "USSR", "Russia"],
    k: ["soviet", "ussr", "russia"],
    v: "🧊",
    c: "The Cold War era",
  },
  {
    n: 109,
    q: "During the Cold War, what was one main concern of the United States?",
    a: ["Communism", "Nuclear war"],
    k: ["communism", "nuclear"],
    v: "☢️",
    c: "Communism and nuclear war",
  },
  {
    n: 110,
    q: "Why did the United States enter the Korean War?",
    a: ["To stop the spread of communism"],
    k: ["communism"],
    v: "🌏",
    c: "Korea, 1950–1953",
  },
  {
    n: 111,
    q: "Why did the United States enter the Vietnam War?",
    a: ["To stop the spread of communism"],
    k: ["communism"],
    v: "🌿",
    c: "Vietnam, 1955–1975",
  },
  {
    n: 112,
    q: "What did the civil rights movement do?",
    a: ["Fought to end racial discrimination"],
    k: ["discrimination", "racial"],
    v: "✊",
    c: "The March on Washington, 1963",
  },
  {
    n: 113,
    q: "Martin Luther King, Jr. is famous for many things. Name one.",
    a: [
      "Fought for civil rights",
      "Worked for equality for all Americans",
      'Worked to ensure people would "not be judged by the color of their skin, but by the content of their character"',
    ],
    k: ["civil rights", "equality", "content of their character"],
    v: "🎤",
    c: 'Dr. King\'s "I Have a Dream," 1963',
  },
  {
    n: 114,
    q: "Why did the United States enter the Persian Gulf War?",
    a: ["To force the Iraqi military from Kuwait"],
    k: ["kuwait", "iraqi"],
    v: "🛢️",
    c: "The Gulf War, 1991",
  },
  {
    n: 115,
    q: "What major event happened on September 11, 2001 in the United States?",
    a: [
      "Terrorists attacked the United States",
      "Planes crashed into the World Trade Center, the Pentagon, and a field in Pennsylvania",
    ],
    k: ["terrorist", "world trade", "pentagon", "pennsylvania", "attacked"],
    v: "🕯️",
    c: "September 11, 2001",
  },
  {
    n: 116,
    q: "Name one U.S. military conflict after the September 11, 2001 attacks.",
    a: ["(Global) War on Terror", "War in Afghanistan", "War in Iraq"],
    k: ["terror", "afghanistan", "iraq"],
    v: "🌐",
    c: "Post-9/11 conflicts",
  },
  {
    n: 117,
    q: "Name one American Indian tribe in the United States.",
    a: [
      "Apache",
      "Cherokee",
      "Navajo",
      "Sioux",
      "Mohawk",
      "Seneca",
      "...and many more",
    ],
    k: [
      "apache",
      "blackfeet",
      "cayuga",
      "cherokee",
      "cheyenne",
      "chippewa",
      "choctaw",
      "creek",
      "crow",
      "hopi",
      "huron",
      "inupiat",
      "lakota",
      "mohawk",
      "mohegan",
      "navajo",
      "oneida",
      "onondaga",
      "pueblo",
      "seminole",
      "seneca",
      "shawnee",
      "sioux",
      "teton",
      "tuscarora",
    ],
    v: "🪶",
    c: "The Seneca Nation — Rochester's region",
  },
  {
    n: 118,
    q: "Name one example of an American innovation.",
    a: [
      "Light bulb",
      "Automobile",
      "Skyscrapers",
      "Airplane",
      "Assembly line",
      "Landing on the moon",
      "Integrated circuit (IC)",
    ],
    k: [
      "light bulb",
      "automobile",
      "car",
      "skyscraper",
      "airplane",
      "assembly line",
      "moon",
      "integrated circuit",
    ],
    v: "💡",
    c: "American invention — Edison to Apollo",
  },
  {
    n: 119,
    q: "What is the capital of the United States?",
    a: ["Washington, D.C."],
    k: ["washington"],
    v: "🏛️",
    c: "Washington, D.C.",
  },
  {
    n: 120,
    q: "Where is the Statue of Liberty?",
    a: ["New York (Harbor)", "Liberty Island"],
    k: ["new york", "liberty island", "new jersey", "hudson"],
    v: "🗽",
    c: "The Statue of Liberty, New York Harbor",
  },
  {
    n: 121,
    q: "Why does the flag have 13 stripes?",
    a: [
      "(Because there were) 13 original colonies",
      "(The stripes) represent the original colonies",
    ],
    k: ["13", "thirteen", "original colonies"],
    v: "🇺🇸",
    c: "13 stripes for 13 colonies",
  },
  {
    n: 122,
    q: "Why does the flag have 50 stars?",
    a: [
      "One star for each state",
      "Each star represents a state",
      "There are 50 states",
    ],
    k: ["50", "fifty", "each state", "one star"],
    v: "⭐",
    c: "50 stars for 50 states",
  },
  {
    n: 123,
    q: "What is the name of the national anthem?",
    a: ["The Star-Spangled Banner"],
    k: ["star spangled"],
    v: "🎵",
    c: "The Star-Spangled Banner",
  },
  {
    n: 124,
    q: 'The Nation\'s first motto was "E Pluribus Unum." What does that mean?',
    a: ["Out of many, one", "We all become one"],
    k: ["out of many", "become one"],
    v: "🦅",
    c: "E Pluribus Unum — the Great Seal",
  },
  {
    n: 125,
    q: "What is Independence Day?",
    a: [
      "A holiday to celebrate U.S. independence (from Britain)",
      "The country's birthday",
    ],
    k: ["independence", "birthday"],
    v: "🎆",
    c: "The Fourth of July",
  },
  {
    n: 126,
    q: "Name three national U.S. holidays.",
    a: [
      "New Year's Day",
      "Martin Luther King, Jr. Day",
      "Presidents Day",
      "Memorial Day",
      "Juneteenth",
      "Independence Day",
      "Labor Day",
      "Columbus Day",
      "Veterans Day",
      "Thanksgiving",
      "Christmas",
    ],
    k: [
      "new year",
      "martin luther king",
      "president",
      "memorial",
      "juneteenth",
      "independence",
      "labor",
      "columbus",
      "veterans",
      "thanksgiving",
      "christmas",
    ],
    r: 3,
    v: "📅",
    c: "National holidays",
  },
  {
    n: 127,
    q: "What is Memorial Day?",
    a: ["A holiday to honor soldiers who died in military service"],
    k: ["died", "honor soldiers"],
    v: "🪦",
    c: "Honoring the fallen",
  },
  {
    n: 128,
    q: "What is Veterans Day?",
    a: [
      "A holiday to honor people in the (U.S.) military",
      "A holiday to honor people who have served",
    ],
    k: ["military", "served"],
    v: "🎖️",
    c: "Honoring all who served",
  },
];

/* ================= helpers ================= */
const UNIT_SIZE = 10;
const UNITS = Array.from({ length: 13 }, (_, i) =>
  Q.slice(i * UNIT_SIZE, i * UNIT_SIZE + UNIT_SIZE),
); // unit 13 has 8
const norm = (s) =>
  (s || "")
    .toLowerCase()
    .replace(/[-–—]/g, " ")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

function matchAnswer(q, text) {
  const t = " " + norm(text) + " ";
  let hits = 0;
  for (const k of q.k) if (t.includes(k.length < 3 ? " " + k + " " : k)) hits++;
  return hits >= (q.r || 1);
}
function similarity(target, said) {
  const tw = new Set(
    norm(target)
      .split(" ")
      .filter((w) => w.length > 2),
  );
  const sw = new Set(
    norm(said)
      .split(" ")
      .filter((w) => w.length > 2),
  );
  if (!tw.size) return 0;
  let hit = 0;
  tw.forEach((w) => {
    if (sw.has(w)) hit++;
  });
  return hit / tw.size;
}
function speak(text) {
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.92;
    window.speechSynthesis.speak(u);
  } catch (e) {}
}
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ================= local profiles (username + passcode) =================
   These profiles live only in this browser's localStorage — there is no
   server. Passcodes are hashed (SHA-256 when available) so they aren't
   stored as plain text, but this is not real account security: anyone with
   access to this browser's storage can still see/edit the data. */
async function hashPass(text) {
  try {
    if (window.crypto && window.crypto.subtle) {
      const enc = new TextEncoder().encode(text);
      const buf = await window.crypto.subtle.digest("SHA-256", enc);
      return Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    }
  } catch (e) {}
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
  return "fb" + (h >>> 0).toString(16);
}
function loadUsers() {
  try {
    const raw = localStorage.getItem("civics-users");
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}
function saveUsers(users) {
  try {
    localStorage.setItem("civics-users", JSON.stringify(users));
  } catch (e) {}
}

/* ================= microphone hook ================= */
function useMic() {
  const SR =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);
  const [listening, setListening] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [interim, setInterim] = useState("");
  const recRef = useRef(null);
  const cbRef = useRef(null);
  const finalRef = useRef("");

  const start = useCallback(
    async (onDone) => {
      if (!SR) {
        setBlocked(true);
        onDone(null);
        return;
      }
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const s = await navigator.mediaDevices.getUserMedia({ audio: true });
          s.getTracks().forEach((t) => t.stop());
        }
      } catch (err) {
        setBlocked(true);
        setListening(false);
        onDone(null);
        return;
      }
      try {
        const rec = new SR();
        rec.lang = "en-US";
        rec.interimResults = true;
        rec.continuous = false;
        rec.maxAlternatives = 1;
        finalRef.current = "";
        cbRef.current = onDone;
        rec.onresult = (e) => {
          let fin = "",
            inter = "";
          for (let i = 0; i < e.results.length; i++) {
            if (e.results[i].isFinal) fin += e.results[i][0].transcript + " ";
            else inter += e.results[i][0].transcript;
          }
          finalRef.current = fin;
          setInterim(fin + inter);
        };
        rec.onend = () => {
          setListening(false);
          setInterim("");
          const cb = cbRef.current;
          cbRef.current = null;
          if (cb) cb(finalRef.current.trim());
        };
        rec.onerror = (e) => {
          if (
            e &&
            (e.error === "not-allowed" ||
              e.error === "service-not-allowed" ||
              e.error === "audio-capture" ||
              e.error === "network")
          )
            setBlocked(true);
          setListening(false);
          setInterim("");
          const cb = cbRef.current;
          cbRef.current = null;
          if (cb) cb(null);
        };
        recRef.current = rec;
        setListening(true);
        rec.start();
      } catch (e) {
        setBlocked(true);
        setListening(false);
        onDone(null);
      }
    },
    [SR],
  );

  const stop = useCallback(() => {
    try {
      recRef.current && recRef.current.stop();
    } catch (e) {}
  }, []);
  return { supported: !!SR, blocked, listening, interim, start, stop };
}

/* ================= visual card ================= */
function VisualCard({ q }) {
  return (
    <div className="visual">
      <div className="visual-emoji" aria-hidden="true">
        {q.v}
      </div>
      <div className="visual-cap">{q.c}</div>
    </div>
  );
}

/* ================= mic + type input ================= */
function AnswerInput({ mic, onSubmit, prompt }) {
  const [typed, setTyped] = useState("");
  const submitTyped = () => {
    if (typed.trim()) {
      onSubmit(typed);
      setTyped("");
    }
  };
  const micUsable = mic.supported && !mic.blocked;
  return (
    <div className="answer-box">
      {micUsable && (
        <button
          className={"mic-btn" + (mic.listening ? " live" : "")}
          onClick={() =>
            mic.listening
              ? mic.stop()
              : mic.start((t) => {
                  if (t) onSubmit(t);
                })
          }
        >
          <span className="mic-icon">{mic.listening ? "◉" : "🎙"}</span>
          {mic.listening ? "Listening… tap when done" : prompt}
        </button>
      )}
      {mic.listening && <div className="interim">{mic.interim || "…"}</div>}
      {!micUsable && (
        <div className="mic-note">
          🎙 The microphone is blocked in this preview (the artifact sandbox
          doesn't grant mic access). Say your answer <b>out loud anyway</b> for
          practice, then type it below to check it. Voice input will work when
          you run this app in your own browser or Expo build.
        </div>
      )}
      <div className="typed-row">
        <input
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          autoFocus={!micUsable}
          onKeyDown={(e) => e.key === "Enter" && submitTyped()}
          placeholder={
            micUsable ? "…or type your answer" : "Type your answer here"
          }
        />
        <button className="ghost" onClick={submitTyped}>
          Submit
        </button>
      </div>
    </div>
  );
}

/* ================= learn one question ================= */
function LearnCard({ q, onMastered, mic, onPrev, onForward, answered }) {
  const [reps, setReps] = useState(0); // 0..3 successful repetitions
  const [phase, setPhase] = useState("repeat"); // repeat | answer | wrong | right
  const [feedback, setFeedback] = useState("");

  const clean = (s) =>
    s
      .replace(/\(.*?\)/g, " ")
      .replace(/\[.*?\]/g, " ")
      .replace(/["“”]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  const need = q.r || 1;
  const drill = q.a.slice(0, need).map(clean); // the answer(s) we teach
  const answerText = drill.join(", ");
  const teach = () => speak(q.q + " ... Remember this answer: " + answerText);
  useEffect(() => {
    setReps(0);
    setPhase("repeat");
    setFeedback("");
    teach();
  }, [q]);

  const handleRepeat = (text) => {
    if (text === null) {
      return;
    }
    if (matchAnswer(q, text)) {
      const nr = reps + 1;
      setReps(nr);
      setFeedback("");
      if (nr >= 3) {
        setPhase("answer");
        speak("Great. Now answer from memory. " + q.q);
      } else speak("Good. Once more: " + answerText);
    } else {
      setFeedback("That didn't match — say this answer: " + answerText);
      speak("The answer is: " + answerText);
    }
  };
  const forceCount = () => {
    const nr = reps + 1;
    setReps(nr);
    setFeedback("");
    if (nr >= 3) {
      setPhase("answer");
      speak("Now answer from memory. " + q.q);
    }
  };

  const handleAnswer = (text) => {
    if (text === null) return;
    if (matchAnswer(q, text)) {
      setPhase("right");
      speak("Correct!");
    } else {
      setPhase("wrong");
      speak("Not quite. The answer is: " + answerText);
    }
  };

  return (
    <div className="card">
      <div className="q-head">
        <span className="q-num">Question {q.n}</span>
        <div className="pips">
          {[0, 1, 2].map((i) => (
            <span key={i} className={"pip" + (reps > i ? " full" : "")} />
          ))}
        </div>
      </div>
      {(onPrev || onForward || answered) && (
        <div className="nav-row">
          {onPrev && (
            <button className="ghost small" onClick={onPrev}>
              ← Previous
            </button>
          )}
          {answered && (
            <span className="answered-badge">✓ Answered — you can retry</span>
          )}
          {onForward && (
            <button className="ghost small fwd" onClick={onForward}>
              Next unanswered →
            </button>
          )}
        </div>
      )}
      <VisualCard q={q} />
      <h2 className="q-text">{q.q}</h2>
      {phase === "repeat" && (
        <>
          <div className="drill">
            <div className="ans-title">
              Learn this answer{need > 1 ? "s" : ""}
            </div>
            <div className="drill-ans">{drill.join("  ·  ")}</div>
            {q.a.length > need && (
              <details className="alt">
                <summary>Other accepted answers ({q.a.length - need})</summary>
                <ul>
                  {q.a.slice(need).map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </details>
            )}
          </div>
          <button className="ghost small" onClick={teach}>
            🔊 Hear question &amp; answer again
          </button>
          <p className="step-label">
            Step 1 — Say the <b>answer</b> aloud {3 - reps} more time
            {3 - reps > 1 ? "s" : ""} ({reps}/3)
          </p>
          {feedback && <p className="warn">{feedback}</p>}
          <AnswerInput
            mic={mic}
            onSubmit={handleRepeat}
            prompt="Tap and speak the answer"
          />
          <button className="ghost small" onClick={forceCount}>
            Mic trouble? Count this repetition
          </button>
        </>
      )}

      {phase === "answer" && (
        <>
          <button className="ghost small" onClick={() => speak(q.q)}>
            🔊 Hear the question again
          </button>
          <p className="step-label">
            Step 2 — Answer it from memory (answer hidden)
          </p>
          <AnswerInput
            mic={mic}
            onSubmit={handleAnswer}
            prompt="Tap and say your answer"
          />
        </>
      )}

      {phase === "right" && (
        <div className="result ok">
          <div className="result-mark">✓ Correct</div>
          <AnswerList q={q} />
          <button className="primary" onClick={onMastered}>
            Next question →
          </button>
        </div>
      )}

      {phase === "wrong" && (
        <div className="result bad">
          <div className="result-mark">✗ Not yet — study the answer</div>
          <AnswerList q={q} />
          <button
            className="primary"
            onClick={() => {
              setReps(0);
              setPhase("repeat");
              teach();
            }}
          >
            Practice this question again
          </button>
        </div>
      )}
    </div>
  );
}

function AnswerList({ q }) {
  return (
    <div className="ans-list">
      <div className="ans-title">Accepted answers</div>
      <ul>
        {q.a.map((a, i) => (
          <li key={i}>{a}</li>
        ))}
      </ul>
      {q.r > 1 && <div className="ans-note">You must give {q.r} of these.</div>}
    </div>
  );
}

/* ================= quiz (unit quiz + midterm share this) ================= */
function Quiz({ questions, title, mic, onFinish, onCorrect }) {
  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState([]);
  const [reveal, setReveal] = useState(null); // {correct, said}
  const q = questions[idx];

  useEffect(() => {
    setIdx(0);
    setResults([]);
    setReveal(null);
  }, [questions]);
  useEffect(() => {
    if (q) speak(q.q);
  }, [idx, questions]);

  const submit = (text) => {
    const ok = matchAnswer(q, text);
    setReveal({ correct: ok, said: text });
    speak(ok ? "Correct." : "Incorrect.");
    if (ok && onCorrect) onCorrect(q);
  };
  const next = () => {
    const newResults = [...results, { q, correct: reveal.correct }];
    setReveal(null);
    if (idx + 1 < questions.length) {
      setResults(newResults);
      setIdx(idx + 1);
    } else onFinish(newResults);
  };

  return (
    <div className="card">
      <div className="q-head">
        <span className="q-num">
          {title} — {idx + 1} of {questions.length}
        </span>
        <div className="quiz-dots">
          {questions.map((_, i) => {
            const r = results[i];
            return (
              <span
                key={i}
                className={
                  "dot" +
                  (r ? (r.correct ? " ok" : " bad") : i === idx ? " cur" : "")
                }
              />
            );
          })}
        </div>
      </div>
      <h2 className="q-text">{q.q}</h2>
      <button className="ghost small" onClick={() => speak(q.q)}>
        🔊 Hear it again
      </button>
      {!reveal && (
        <AnswerInput
          mic={mic}
          onSubmit={submit}
          prompt="Tap and say your answer"
        />
      )}
      {reveal && (
        <div className={"result " + (reveal.correct ? "ok" : "bad")}>
          <div className="result-mark">
            {reveal.correct ? "✓ Correct" : "✗ Incorrect"}
          </div>
          <div className="said">You said: “{reveal.said}”</div>
          <AnswerList q={q} />
          <button className="primary" onClick={next}>
            {idx + 1 < questions.length ? "Next question →" : "See results"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ================= read-only view of a question ================= */
function QuestionView({ q, mastered, onBack }) {
  return (
    <div className="card">
      <div className="q-head">
        <span className="q-num">Question {q.n}</span>
        <span className={"mastered-badge" + (mastered ? "" : " preview")}>
          {mastered ? "✓ Mastered" : "Preview"}
        </span>
      </div>
      <VisualCard q={q} />
      <h2 className="q-text">{q.q}</h2>
      <AnswerList q={q} />
      <button
        className="ghost small"
        onClick={() => speak(q.q + " ... " + q.a[0])}
      >
        🔊 Hear question &amp; answer
      </button>
      <button className="primary" onClick={onBack}>
        ← Back to unit questions
      </button>
    </div>
  );
}

/* ================= unit flow ================= */
function UnitFlow({ unitIdx, mic, completedQs, onComplete, onQuestionDone, onExit }) {
  const all = UNITS[unitIdx];
  const [stage, setStage] = useState("overview"); // overview | learn | quiz | review | relearn
  const [list, setList] = useState(all); // current learning list
  const [pos, setPos] = useState(0);
  const [maxPos, setMaxPos] = useState(0); // frontier: first not-yet-answered question
  const [lastResults, setLastResults] = useState(null);
  const [viewQ, setViewQ] = useState(null); // question being viewed read-only
  const [quizQs, setQuizQs] = useState(all); // questions in the active quiz attempt

  const firstIncompleteIdx = all.findIndex(
    (q) => !completedQs.includes(q.n),
  );
  const allDone = firstIncompleteIdx === -1;
  const someDone = all.some((q) => completedQs.includes(q.n));

  // Always rebuild the quiz from whatever isn't mastered yet (freshly
  // shuffled), so leaving and re-entering the quiz never re-asks questions
  // already answered correctly. If everything's already mastered (a
  // deliberate retake), quiz the whole unit again.
  const enterQuiz = () => {
    const remaining = all.filter((q) => !completedQs.includes(q.n));
    setQuizQs(shuffle(remaining.length ? remaining : all));
    setViewQ(null);
    setStage("quiz");
  };

  const startLearning = () => {
    setViewQ(null);
    if (allDone) {
      enterQuiz();
    } else {
      setList(all);
      setPos(firstIncompleteIdx);
      setMaxPos(firstIncompleteIdx);
      setStage("learn");
    }
  };

  const mastered = () => {
    if (pos === maxPos) {
      // answered the frontier question
      if (pos + 1 < list.length) {
        setMaxPos(maxPos + 1);
        setPos(pos + 1);
      } else enterQuiz();
    } else {
      // retried an already-answered one
      setPos(pos + 1);
    }
  };
  const quizDone = (results) => {
    const wrong = results.filter((r) => !r.correct).map((r) => r.q);
    setLastResults(results);
    if (wrong.length === 0) {
      onComplete();
    } else {
      setList(wrong);
      setPos(0);
      setMaxPos(0);
      setStage("review");
    }
  };

  return (
    <div>
      <div className="topbar">
        <button className="ghost small" onClick={onExit}>
          ← Units
        </button>
        <span className="unit-label">
          Unit {unitIdx + 1} · Questions {all[0].n}–{all[all.length - 1].n}
        </span>
        {stage === "overview" && (
          <span className="unit-stage">
            {viewQ ? "Reviewing Q" + viewQ.n : "Unit overview"}
          </span>
        )}
        {stage === "learn" && (
          <span className="unit-stage">
            Learning {pos + 1}/{list.length}
          </span>
        )}
        {stage === "relearn" && (
          <span className="unit-stage">
            Reviewing {pos + 1}/{list.length}
          </span>
        )}
        {stage === "quiz" && <span className="unit-stage">Unit quiz</span>}
      </div>

      {stage === "overview" && viewQ && (
        <QuestionView
          q={viewQ}
          mastered={completedQs.includes(viewQ.n)}
          onBack={() => setViewQ(null)}
        />
      )}

      {stage === "overview" && !viewQ && (
        <div className="card">
          <h2 className="q-text">Unit {unitIdx + 1} questions</h2>
          <p className="step-label">
            Tap any question below to preview it — no practicing required.
            Mastered ones are marked ✓. Ready to be tested? Take the unit quiz
            directly, or start guided practice below.
          </p>
          <ul className="q-overview-list">
            {all.map((q) => {
              const isDone = completedQs.includes(q.n);
              return (
                <li
                  key={q.n}
                  className={"q-overview-item" + (isDone ? " done" : "")}
                >
                  <span className="q-overview-num">Q{q.n}</span>
                  <span className="q-overview-text">{q.q}</span>
                  {isDone && <span className="q-overview-check">✓</span>}
                  <button className="ghost small" onClick={() => setViewQ(q)}>
                    View
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="btn-row">
            <button className="primary" onClick={startLearning}>
              {allDone
                ? "Retake unit quiz"
                : someDone
                  ? "Continue unit"
                  : "Start unit"}
            </button>
            {!allDone && (
              <button className="ghost" onClick={enterQuiz}>
                Skip to unit quiz
              </button>
            )}
          </div>
        </div>
      )}

      {(stage === "learn" || stage === "relearn") && (
        <LearnCard
          q={list[pos]}
          mic={mic}
          onPrev={pos > 0 ? () => setPos(pos - 1) : null}
          answered={pos < maxPos}
          onForward={pos < maxPos ? () => setPos(maxPos) : null}
          onMastered={mastered}
        />
      )}

      {stage === "quiz" && (
        <Quiz
          questions={quizQs}
          title={"Unit " + (unitIdx + 1) + " quiz"}
          mic={mic}
          onFinish={quizDone}
          onCorrect={onQuestionDone}
        />
      )}

      {stage === "review" && (
        <div className="card">
          <h2 className="q-text">Almost there</h2>
          <p>
            You got{" "}
            <b>
              {lastResults.filter((r) => r.correct).length} of{" "}
              {lastResults.length}
            </b>
            . You need to get every question right at least once to master
            the unit.
          </p>
          <p>
            Let's re-practice the {list.length} you missed, then retake the
            quiz on just those:
          </p>
          <ul className="miss-list">
            {list.map((q) => (
              <li key={q.n}>
                Q{q.n}: {q.q}
              </li>
            ))}
          </ul>
          <button className="primary" onClick={() => setStage("relearn")}>
            Practice missed questions
          </button>
        </div>
      )}
    </div>
  );
}

/* ================= login / create profile ================= */
function Login({ onLogin }) {
  const [mode, setMode] = useState("signin"); // signin | signup
  const [username, setUsername] = useState("");
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const name = username.trim();
    if (!name || !passcode) {
      setError("Enter a name and a passcode.");
      return;
    }
    setBusy(true);
    setError("");
    const users = loadUsers();
    const key = name.toLowerCase();
    const hash = await hashPass(passcode);

    if (mode === "signup") {
      if (users[key]) {
        setError("That name is already taken — try signing in instead.");
        setBusy(false);
        return;
      }
      users[key] = { name, passHash: hash, createdAt: Date.now() };
      saveUsers(users);
      if (Object.keys(users).length === 1) {
        const legacy = localStorage.getItem("civics-progress");
        if (legacy) localStorage.setItem("civics-progress-" + key, legacy);
      }
      onLogin(key, name);
    } else {
      const u = users[key];
      if (!u || u.passHash !== hash) {
        setError("Wrong name or passcode.");
        setBusy(false);
        return;
      }
      onLogin(key, u.name);
    }
    setBusy(false);
  };

  return (
    <div className="card login-card">
      <h2 className="q-text">
        {mode === "signup" ? "Create your profile" : "Welcome back"}
      </h2>
      <p className="login-note">
        Each person practicing on this device gets their own name and
        passcode, so everyone's completed units are tracked separately. This
        stays on this device/browser only.
      </p>
      {error && <p className="warn">{error}</p>}
      <div className="login-field">
        <label>Name</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="e.g. Bobby"
          autoFocus
        />
      </div>
      <div className="login-field">
        <label>Passcode</label>
        <input
          type="password"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Choose or enter a passcode"
        />
      </div>
      <button className="primary" onClick={submit} disabled={busy}>
        {mode === "signup" ? "Create profile" : "Sign in"}
      </button>
      <button
        className="ghost small"
        onClick={() => {
          setMode(mode === "signup" ? "signin" : "signup");
          setError("");
        }}
      >
        {mode === "signup"
          ? "Already have a profile? Sign in"
          : "New here? Create a profile"}
      </button>
    </div>
  );
}

/* ================= main app ================= */
export default function CivicsCoach() {
  const mic = useMic();
  const [currentUser, setCurrentUser] = useState(null); // {key, name}
  const [authLoaded, setAuthLoaded] = useState(false);
  const [screen, setScreen] = useState("home"); // home | unit | midterm | midtermResult
  const [unitIdx, setUnitIdx] = useState(0);
  const [done, setDone] = useState([]); // completed unit indexes
  const [completedQs, setCompletedQs] = useState([]); // question numbers answered correctly in a quiz
  const [midterm, setMidterm] = useState({ best: 0, taken: false });
  const [midtermQs, setMidtermQs] = useState([]);
  const [midtermRes, setMidtermRes] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("civics-current-user");
      if (raw) setCurrentUser(JSON.parse(raw));
    } catch (e) {}
    setAuthLoaded(true);
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setLoaded(true);
      return;
    }
    setLoaded(false);
    try {
      const raw = localStorage.getItem(
        "civics-progress-" + currentUser.key,
      );
      if (raw) {
        const p = JSON.parse(raw);
        setDone(p.done || []);
        setCompletedQs(p.completedQs || []);
        setMidterm(p.midterm || { best: 0, taken: false });
      } else {
        setDone([]);
        setCompletedQs([]);
        setMidterm({ best: 0, taken: false });
      }
    } catch (e) {}
    setLoaded(true);
  }, [currentUser]);

  const save = (d, m, c) => {
    if (!currentUser) return;
    try {
      localStorage.setItem(
        "civics-progress-" + currentUser.key,
        JSON.stringify({ done: d, midterm: m, completedQs: c }),
      );
    } catch (e) {}
  };

  const handleLogin = (key, name) => {
    const u = { key, name };
    setCurrentUser(u);
    try {
      localStorage.setItem("civics-current-user", JSON.stringify(u));
    } catch (e) {}
  };
  const handleLogout = () => {
    setCurrentUser(null);
    setScreen("home");
    try {
      localStorage.removeItem("civics-current-user");
    } catch (e) {}
  };

  const markQuestionDone = (q) => {
    setCompletedQs((prev) => {
      if (prev.includes(q.n)) return prev;
      const next = [...prev, q.n];
      save(done, midterm, next);
      return next;
    });
  };
  const completeUnit = () => {
    const d = done.includes(unitIdx) ? done : [...done, unitIdx];
    setDone(d);
    save(d, midterm, completedQs);
    setScreen("home");
    speak("Congratulations! Unit " + (unitIdx + 1) + " complete.");
  };
  const startMidterm = () => {
    setMidtermQs(shuffle(Q.slice(0, 60)).slice(0, 30));
    setMidtermRes(null);
    setScreen("midterm");
  };
  const midtermDone = (results) => {
    const score = results.filter((r) => r.correct).length;
    const m = { best: Math.max(midterm.best, score), taken: true };
    setMidterm(m);
    save(done, m, completedQs);
    setMidtermRes(results);
    setScreen("midtermResult");
  };

  const midtermUnlocked = [0, 1, 2, 3, 4, 5].every((i) => done.includes(i));
  const totalDoneQs = completedQs.length;

  if (!authLoaded) return <div className="app" />;

  if (!currentUser)
    return (
      <div className="app">
        <Style />
        <header className="hero">
          <div className="seal">★</div>
          <h1>Civics Coach</h1>
          <p className="tagline">
            2025 USCIS Naturalization Test · 128 questions · listen, repeat
            ×3, answer
          </p>
        </header>
        <Login onLogin={handleLogin} />
      </div>
    );

  if (!loaded)
    return (
      <div className="app">
        <Style />
        <div className="card">Loading your progress…</div>
      </div>
    );

  return (
    <div className="app">
      <Style />
      {screen === "home" && (
        <>
          <header className="hero">
            <div className="seal">★</div>
            <h1>Civics Coach</h1>
            <p className="tagline">
              2025 USCIS Naturalization Test · 128 questions · listen, repeat
              ×3, answer
            </p>
            <div className="user-bar">
              <span>Signed in as {currentUser.name}</span>
              <button className="ghost small" onClick={handleLogout}>
                Switch profile
              </button>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: (totalDoneQs / 128) * 100 + "%" }}
              />
            </div>
            <p className="progress-txt">
              {totalDoneQs} of 128 questions mastered
            </p>
          </header>

          <div className="unit-grid">
            {UNITS.map((u, i) => {
              const locked =
                i > 0 && !done.includes(i - 1) && !done.includes(i);
              const isDone = done.includes(i);
              const unitMastered = u.filter((q) =>
                completedQs.includes(q.n),
              ).length;
              return (
                <button
                  key={i}
                  disabled={locked}
                  className={
                    "unit-card" +
                    (isDone ? " done" : "") +
                    (locked ? " locked" : "")
                  }
                  onClick={() => {
                    setUnitIdx(i);
                    setScreen("unit");
                  }}
                >
                  <span className="unit-n">Unit {i + 1}</span>
                  <span className="unit-range">
                    Q{u[0].n}–{u[u.length - 1].n}
                  </span>
                  <span className="unit-status">
                    {isDone
                      ? "✓ Passed"
                      : locked
                        ? "🔒 Locked"
                        : unitMastered > 0
                          ? unitMastered + "/" + u.length + " · Continue →"
                          : "Start →"}
                  </span>
                </button>
              );
            })}
            <button
              className={
                "unit-card midterm" + (midtermUnlocked ? "" : " locked")
              }
              disabled={!midtermUnlocked}
              onClick={startMidterm}
            >
              <span className="unit-n">Midterm</span>
              <span className="unit-range">30 random of Q1–60</span>
              <span className="unit-status">
                {midtermUnlocked
                  ? midterm.taken
                    ? "Best: " + midterm.best + "/30 · Retake →"
                    : "Start →"
                  : "🔒 Finish units 1–6"}
              </span>
            </button>
          </div>
          <p className="footnote">
            Officials' names (President, Speaker, Governor, senators…) change —
            verify at uscis.gov/citizenship/testupdates before your interview.
            Progress saves automatically.
          </p>
        </>
      )}

      {screen === "unit" && (
        <UnitFlow
          unitIdx={unitIdx}
          mic={mic}
          completedQs={completedQs}
          onComplete={completeUnit}
          onQuestionDone={markQuestionDone}
          onExit={() => setScreen("home")}
        />
      )}

      {screen === "midterm" && (
        <div>
          <div className="topbar">
            <button className="ghost small" onClick={() => setScreen("home")}>
              ← Exit midterm
            </button>
          </div>
          <Quiz
            questions={midtermQs}
            title="Midterm"
            mic={mic}
            onFinish={midtermDone}
          />
        </div>
      )}

      {screen === "midtermResult" && midtermRes && (
        <div className="card">
          <h2 className="q-text">Midterm results</h2>
          <div
            className={
              "big-score " +
              (midtermRes.filter((r) => r.correct).length >= 24 ? "ok" : "bad")
            }
          >
            {midtermRes.filter((r) => r.correct).length} / 30
          </div>
          <p>
            {midtermRes.filter((r) => r.correct).length >= 24
              ? "Strong pass — the real test only needs 12 of 20!"
              : "Keep practicing the missed ones below, then retake."}
          </p>
          {midtermRes.some((r) => !r.correct) && (
            <ul className="miss-list">
              {midtermRes
                .filter((r) => !r.correct)
                .map((r) => (
                  <li key={r.q.n}>
                    Q{r.q.n}: {r.q.q} — <i>{r.q.a[0]}</i>
                  </li>
                ))}
            </ul>
          )}
          <div className="btn-row">
            <button className="primary" onClick={startMidterm}>
              Retake midterm
            </button>
            <button className="ghost" onClick={() => setScreen("home")}>
              Back to units
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= styles ================= */
function Style() {
  return (
    <style>{`
  .app{max-width:680px;margin:0 auto;padding:20px 16px 60px;font-family:"Avenir Next","Segoe UI",system-ui,sans-serif;color:#182236;background:#F2F4F8;min-height:100vh}
  .hero{text-align:center;padding:28px 12px 20px;background:#14264C;border-radius:16px;color:#F5F7FB;margin-bottom:20px;position:relative;overflow:hidden}
  .hero::after{content:"";position:absolute;inset:8px;border:1px solid rgba(201,162,39,.45);border-radius:10px;pointer-events:none}
  .seal{width:52px;height:52px;margin:0 auto 10px;border-radius:50%;border:2px solid #C9A227;color:#C9A227;display:flex;align-items:center;justify-content:center;font-size:26px}
  .hero h1{font-family:Georgia,"Iowan Old Style",serif;font-size:32px;margin:0;letter-spacing:.5px}
  .tagline{font-size:13px;opacity:.85;margin:8px 0 16px}
  .progress-bar{height:8px;background:rgba(255,255,255,.15);border-radius:99px;margin:0 24px;overflow:hidden}
  .progress-fill{height:100%;background:#C9A227;border-radius:99px;transition:width .5s}
  .progress-txt{font-size:12px;opacity:.8;margin:8px 0 0}
  .unit-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
  .unit-card{background:#fff;border:1px solid #D8DEE9;border-radius:12px;padding:14px;text-align:left;cursor:pointer;display:flex;flex-direction:column;gap:4px;font:inherit;transition:transform .12s,box-shadow .12s}
  .unit-card:not(:disabled):hover{transform:translateY(-2px);box-shadow:0 6px 16px rgba(20,38,76,.12)}
  .unit-card.done{border-color:#2E7D4F;background:#F1F8F3}
  .unit-card.locked{opacity:.5;cursor:not-allowed}
  .unit-card.midterm{border:1.5px solid #C9A227;background:#FDF9EE;grid-column:1/-1}
  .unit-n{font-family:Georgia,serif;font-weight:700;font-size:17px;color:#14264C}
  .unit-range{font-size:12px;color:#5B6478}
  .unit-status{font-size:12px;font-weight:600;color:#2E7D4F;margin-top:4px}
  .unit-card:not(.done) .unit-status{color:#8A5A00}
  .card{background:#fff;border:1px solid #D8DEE9;border-radius:16px;padding:22px;box-shadow:0 4px 20px rgba(20,38,76,.06)}
  .topbar{display:flex;align-items:center;gap:12px;margin-bottom:14px;flex-wrap:wrap}
  .unit-label{font-weight:700;color:#14264C}
  .unit-stage{margin-left:auto;font-size:13px;color:#5B6478}
  .q-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
  .q-num{font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#8A5A00;font-weight:700}
  .pips{display:flex;gap:6px}
  .pip{width:14px;height:14px;border-radius:50%;border:2px solid #C9A227;background:transparent;transition:background .3s}
  .pip.full{background:#C9A227}
  .visual{background:linear-gradient(160deg,#14264C,#1E3A6E);border-radius:12px;padding:22px 16px;text-align:center;margin-bottom:14px}
  .visual-emoji{font-size:58px;line-height:1;filter:drop-shadow(0 4px 10px rgba(0,0,0,.35))}
  .visual-cap{color:#D7DEEC;font-size:13px;margin-top:10px;font-style:italic;font-family:Georgia,serif}
  .q-text{font-family:Georgia,serif;font-size:21px;line-height:1.35;margin:4px 0 10px;color:#14264C}
  .step-label{font-size:14px;color:#3A4560;margin:14px 0 8px}
  .warn{color:#A33B2E;font-size:14px}
  .nav-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:10px}
  .nav-row .ghost.small{margin-bottom:0}
  .nav-row .fwd{margin-left:auto}
  .answered-badge{font-size:12px;font-weight:700;color:#2E7D4F;background:#F1F8F3;border:1px solid #2E7D4F;border-radius:99px;padding:5px 12px}
  .mic-btn{width:100%;padding:16px;border-radius:12px;border:none;background:#14264C;color:#fff;font-size:16px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;font-family:inherit}
  .mic-btn.live{background:#A33B2E;animation:pulse 1.4s infinite}
  .mic-btn:disabled{background:#9AA3B5;cursor:not-allowed}
  @keyframes pulse{0%{box-shadow:0 0 0 0 rgba(163,59,46,.45)}70%{box-shadow:0 0 0 16px rgba(163,59,46,0)}100%{box-shadow:0 0 0 0 rgba(163,59,46,0)}}
  @media (prefers-reduced-motion:reduce){.mic-btn.live{animation:none}}
  .mic-icon{font-size:20px}
  .interim{margin-top:8px;font-style:italic;color:#5B6478;min-height:20px}
  .mic-note{font-size:12px;color:#A33B2E;margin-top:6px}
  .typed-row{display:flex;gap:8px;margin-top:10px}
  .typed-row input{flex:1;padding:12px;border:1px solid #C6CEDC;border-radius:10px;font:inherit;font-size:15px}
  .typed-row input:focus{outline:2px solid #14264C;outline-offset:1px}
  .ghost{background:#EDF0F6;border:1px solid #C6CEDC;border-radius:10px;padding:10px 14px;cursor:pointer;font:inherit;font-size:14px;color:#14264C}
  .ghost.small{padding:6px 12px;font-size:13px;margin-bottom:6px}
  .primary{background:#14264C;color:#fff;border:none;border-radius:10px;padding:14px 20px;font:inherit;font-size:15px;font-weight:700;cursor:pointer;margin-top:12px;width:100%}
  .primary:hover{background:#1E3A6E}
  .result{margin-top:16px;border-radius:12px;padding:16px}
  .result.ok{background:#F1F8F3;border:1px solid #2E7D4F}
  .result.bad{background:#FBF1EF;border:1px solid #A33B2E}
  .result-mark{font-weight:800;font-size:17px;margin-bottom:8px}
  .result.ok .result-mark{color:#2E7D4F}.result.bad .result-mark{color:#A33B2E}
  .said{font-size:14px;color:#5B6478;font-style:italic;margin-bottom:8px}
  .ans-list{background:#fff;border-radius:10px;padding:12px;border:1px solid #E2E7F0}
  .ans-title{font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#8A5A00;font-weight:700;margin-bottom:6px}
  .ans-list ul{margin:0;padding-left:20px;font-size:14px}
  .ans-list li{margin:3px 0}
  .ans-note{font-size:12px;color:#A33B2E;margin-top:6px;font-weight:600}
  .drill{background:#FDF9EE;border:1px solid #C9A227;border-radius:12px;padding:14px;margin-bottom:10px}
  .drill-ans{font-family:Georgia,serif;font-size:19px;font-weight:700;color:#14264C;margin-top:4px}
  .alt{margin-top:8px;font-size:13px;color:#5B6478}
  .alt summary{cursor:pointer}
  .alt ul{margin:6px 0 0;padding-left:18px}
  .quiz-dots{display:flex;gap:4px;flex-wrap:wrap}
  .dot{width:10px;height:10px;border-radius:50%;background:#D8DEE9}
  .dot.cur{background:#14264C}.dot.ok{background:#2E7D4F}.dot.bad{background:#A33B2E}
  .miss-list{font-size:14px;padding-left:20px}
  .miss-list li{margin:6px 0}
  .big-score{font-family:Georgia,serif;font-size:52px;font-weight:700;text-align:center;margin:10px 0}
  .big-score.ok{color:#2E7D4F}.big-score.bad{color:#A33B2E}
  .btn-row{display:flex;gap:10px}
  .btn-row .ghost{margin-top:12px;flex:1}
  .btn-row .primary{flex:1}
  .footnote{font-size:12px;color:#5B6478;text-align:center;margin-top:18px;line-height:1.5}
  .login-card{max-width:420px;margin:0 auto}
  .login-note{font-size:13px;color:#5B6478;line-height:1.5;margin-bottom:16px}
  .login-field{margin-bottom:12px}
  .login-field label{display:block;font-size:12px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:#8A5A00;margin-bottom:4px}
  .login-field input{width:100%;padding:12px;border:1px solid #C6CEDC;border-radius:10px;font:inherit;font-size:15px;box-sizing:border-box}
  .login-field input:focus{outline:2px solid #14264C;outline-offset:1px}
  .user-bar{display:flex;align-items:center;justify-content:center;gap:10px;font-size:13px;opacity:.9;margin-top:10px}
  .user-bar .ghost.small{margin-bottom:0}
  .mastered-badge{font-size:12px;font-weight:700;color:#2E7D4F;background:#F1F8F3;border:1px solid #2E7D4F;border-radius:99px;padding:5px 12px}
  .mastered-badge.preview{color:#5B6478;background:#EDF0F6;border-color:#C6CEDC}
  .q-overview-list{list-style:none;margin:12px 0;padding:0;display:flex;flex-direction:column;gap:6px}
  .q-overview-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid #E2E7F0;border-radius:10px;background:#fff}
  .q-overview-item.done{border-color:#2E7D4F;background:#F1F8F3}
  .q-overview-num{font-size:12px;font-weight:700;color:#8A5A00;flex-shrink:0;width:34px}
  .q-overview-text{font-size:13px;color:#182236;flex:1}
  .q-overview-check{color:#2E7D4F;font-weight:700;flex-shrink:0}
  .q-overview-item .ghost.small{margin-bottom:0;flex-shrink:0}
`}</style>
  );
}
