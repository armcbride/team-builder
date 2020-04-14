const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output")
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
let teamMembers = [];

const questions= [
{
    type: "input",
    message: "what is your first and last name?",
    name: "name"
},
{
    type: "input",
    message: "what is your employee id?",
    name: "id"
},
{
    type: "input",
    message: "Enter in your email address?",
    name: "email"
},
{
    type: "list",
    message: "What type of employee are you?",
    choices: ['Manager', 'Engineer', 'Intern'],
    name: "role"
}
];

const inquireQuestions = () => {
    inquirer
        .prompt([
            {
                type: "list",
                message: "Add more members, or complete team?",
                choices: ["add another member", "finish building"],
                name: "buildTeam"
            }
        ]).then(response =>{
            const buildTeam = response.buildTeam;
            switch (buildTeam) {
                case "add another member":
                inquirer.prompt(questions)
                .then(response => {
                    if (response.role === "Manager") {
                        inquirer.prompt({
                            type: "input",
                            message: "What is your office number?",
                            name: "officeNum"
                        }).then(manager => {
                            var newManager = new Manager(response.name, response.id, response.email, manager.officeNum);
                            teamMembers.push(newManager);
                            inquireQuestions();

                        })
                    } else if (response.role === "Engineer") {
                        inquirer.prompt({
                            type: "input",
                            message: "Enter your github username:",
                            name: "github"
                        }).then(engineer => {
                            var newEngineer = new Engineer(response.name, response.id, response.email, engineer.github);
                            teamMembers.push(newEngineer);
                            inquireQuestions();

                        });
                    } else if (response.role === "Intern") {
                        inquirer.prompt({
                            type: "input",
                            message: "What college or university did you attend?",
                            name: "school"
                        }).then(intern => {
                            var newIntern = new Intern(response.name, response.id, response.email, intern.school);
                            teamMembers.push(newIntern);
                            inquireQuestions();

                        });
                    }
                });

                break;
                case "finish building":
                    if (teamMembers.length > 0) {
                        console.log("all done!");
                        renderHTML(render(teamMembers));
                    } else {
                        console.log("no team members");
                    }
                    break;
                default:
                    break;
                    //end of switch

            }

        });
}
inquireQuestions();

function renderHTML(HTML) {
        fs.writeFile(outputPath, HTML, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("Success");


    })
};