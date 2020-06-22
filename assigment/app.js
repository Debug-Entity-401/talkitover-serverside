'use strict';
var inquirer = require('inquirer');
var score = 0;
let Q1 = [
  'Anxity',
  'Chronic Pain',
  'Breakups',
  'Bipolar',
  'Domestic Violence',
  'Eating Disorders',
  'Family Stress',
  'Loneliness',
  'Managing Emotions',
];
(async () => {
  const ans1 = await inquirer.prompt([
    {
      type: 'list',
      name: 'mentalissue',
      message: 'Whats on your mind? Select an issue below that best describes the reason you are here:?',
      default: 'Jake',
      choices: Q1,
    },
  ]);
  let Q2 = [

    `No ${ans1.mentalissue}`,
    `Mild ${ans1.mentalissue}`,
    `Moderate ${ans1.mentalissue}`,
    `Significant ${ans1.mentalissue}`,
  ];


  const ans2 = await inquirer.prompt([
    {
      type: 'list',
      name: 'Question2',
      message: `Dealing with ${ans1.mentalissue} causes me:`,
      choices: Q2,
    },
  ]);
  let Q3 = [
    'Never',
    'Once in a While',
    'Some of the Time',
    'Frequently',
  ];
  const ans3 = await inquirer.prompt([
    {
      type: 'list',
      name: 'Question3',
      message: `${ans1.mentalissue} impacts my work, school, or relationships:`,
      choices: Q3,
    },
  ]);
  let Q4 = [
    'Not Really Important',
    'Somewhat Important',
    'Important',
    'Very Important',
  ];
  const ans4 = await inquirer.prompt([
    {
      type: 'list',
      name: 'Question4',
      message: `Learning how to better manage ${ans1.mentalissue} is:`,
      choices: Q4,
    },
  ]);
  let Q5 = [
    'Id rather not answer at this time',
    'Ive sought professional help one time in the past.',
    'Ive sought professional help several times before this.',
    'Ive sought professional help multiple times in the past.',
  ];
  const ans5 = await inquirer.prompt([
    {
      type: 'list',
      name: 'Question5',
      message: `Have you ever sought or received professional help (therapy, counseling, self-help, group support, or medication) for ${ans1.mentalissue} is:`,
      choices: Q5,
    },
  ]);

  let Q6 =
    [
      ' I am not ready to change in the next 3 months',
      'I am thinking about changing in the next 3 months',
      'I am thinking about changing in the next month',
      'I am ready to make a change today',
      'I have already made some progress',
    ];
  const ans6 = await inquirer.prompt([
    {
      type: 'list',
      name: 'Question6',
      message: `How ready are you to make a change in your life?:`,
      choices: Q6,
    },
  ]);
  let Q7 =
    [
      'Not at all',
      'Several days',
      'More than half the days',
      'Nearly every day',
    ];
  const ans7 = await inquirer.prompt([
    {
      type: 'list',
      name: 'Question7',
      message: `Over the last 2 weeks, how often have you been bothered by little interest or pleasure in doing things?:`,
      choices: Q7,
    },
  ]);
  let Q8 = [
    'Not at all',
    'Several days',
    'More than half the days',
    'Nearly every day',
  ];
  const ans8 = await inquirer.prompt([
    {

      type: 'list',
      name: 'Question8',
      message: `Over the last 2 weeks, how often have you been bothered by thoughts that you would be better off dead or of hurting yourself in some way?:`,
      choices: Q8,
    },
  ]);
  let Q9 = [
    'Not difficult at all',
    'Somewhat difficult',
    'Very difficult',
    'Extremely difficult',
  ];
  const ans9 = await inquirer.prompt([
    {
      type: 'list',
      name: 'Question9',
      message: `If you selected any problems, how difficult have these problems made it for you to do your work, take care of things at home, or get along with other people?:`,
      choices: Q9,
    },
  ]);
  let Q10 = [
    'Not at all',
    'Several days',
    'Over half the days',
    'Nearly every day',
  ];
  const ans10 = await inquirer.prompt([
    {
      type: 'list',
      name: 'Question10',
      message: `Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?:`,
      choices: Q10,
    },
  ]);
  let result = { ...ans1, ...ans2, ...ans3, ...ans4, ...ans5, ...ans6, ...ans7, ...ans8, ...ans9, ...ans10 };
  score = 3 + Q2.indexOf(result.Question2) + Q3.indexOf(result.Question3) + Q4.indexOf(result.Question4) + Q5.indexOf(result.Question5) + Q6.indexOf(result.Question6) + Q7.indexOf(result.Question7)
    + Q8.indexOf(result.Question8) + Q9.indexOf(result.Question9) + Q10.indexOf(result.Question10);
  if(score<10)
  {
    return 'good';
  }
  else if(score>=10 && score<=20)
  {
    return 'need help';
  }
  else if(score>20)
  {
    return 'extreme help';
  }
})()
  .then(console.log)
  .catch(console.error);