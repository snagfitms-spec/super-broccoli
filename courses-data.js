const courses = {

"html-css": {
    id: "html-css",
    title: "HTML & CSS Basics",
    level: "Beginner",
    premium: false,

    description: "Learn how websites are structured and styled from scratch.",

    modules: [
        {
            id: "html-intro",
            title: "Introduction to HTML",

            lessons: [
                {
                    id: "what-is-html",
                    title: "What is HTML?",

                    content: {
                        text: "HTML is the standard language used to create the structure of web pages."
                    },

                    quiz: [
                        {
                            question: "What does HTML stand for?",
                            options: ["Hyper Text Markup Language", "High Text Machine Language", "Home Tool Markup Language"],
                            answer: "Hyper Text Markup Language"
                        }
                    ]
                },

                {
                    id: "basic-structure",
                    title: "Basic Structure of a Web Page",

                    content: {
                        text: "A web page is structured using HTML tags like html, head, and body."
                    }
                },

                {
                    id: "html-tags",
                    title: "HTML Tags Overview",

                    content: {
                        text: "HTML tags are used to define elements like headings, paragraphs, links, and images."
                    }
                }
            ]
        },

        {
            id: "html-elements",
            title: "HTML Elements",

            lessons: [
                {
                    id: "headings-paragraphs",
                    title: "Headings & Paragraphs",

                    content: {
                        text: "Headings define titles (h1-h6), paragraphs define blocks of text."
                    }
                },

                {
                    id: "links-images",
                    title: "Links & Images",

                    content: {
                        text: "Links connect pages and images display visual content."
                    }
                },

                {
                    id: "lists-tables",
                    title: "Lists & Tables",

                    content: {
                        text: "Lists organize items, tables organize structured data."
                    }
                }
            ]
        },

        {
            id: "css-basics",
            title: "CSS Basics",

            lessons: [
                {
                    id: "colors-fonts",
                    title: "Colors & Fonts",

                    content: {
                        text: "CSS controls the design including colors, fonts, and spacing."
                    }
                },

                {
                    id: "spacing-padding",
                    title: "Spacing & Padding",

                    content: {
                        text: "Spacing defines how elements are positioned and separated."
                    }
                },

                {
                    id: "css-selectors",
                    title: "CSS Selectors",

                    content: {
                        text: "Selectors target HTML elements for styling."
                    }
                }
            ]
        }
    ]
},


"javascript": {
    id: "javascript",
    title: "JavaScript Fundamentals",
    level: "Beginner",
    premium: false,

    description: "Learn logic, events, and interactive web development.",

    modules: [
        {
            id: "js-basics",
            title: "JavaScript Basics",

            lessons: [
                {
                    id: "variables",
                    title: "Variables",

                    content: {
                        text: "Variables store data values in JavaScript."
                    }
                },

                {
                    id: "datatypes",
                    title: "Data Types",

                    content: {
                        text: "JavaScript supports strings, numbers, booleans, objects, arrays."
                    }
                },

                {
                    id: "operators",
                    title: "Operators",

                    content: {
                        text: "Operators are used to perform operations like + - * /."
                    }
                }
            ]
        },

        {
            id: "js-logic",
            title: "Functions & Logic",

            lessons: [
                {
                    id: "functions",
                    title: "Functions",

                    content: {
                        text: "Functions are reusable blocks of code."
                    }
                },

                {
                    id: "conditions",
                    title: "Conditions",

                    content: {
                        text: "Conditions allow decision making using if/else."
                    }
                },

                {
                    id: "loops",
                    title: "Loops",

                    content: {
                        text: "Loops repeat actions multiple times."
                    }
                }
            ]
        }
    ]
},


"fullstack": {
    id: "fullstack",
    title: "Full Stack Introduction",
    level: "Intermediate",
    premium: true,

    description: "Frontend + backend systems and real-world architecture.",

    modules: [
        {
            id: "frontend",
            title: "Frontend Basics",

            lessons: [
                {
                    id: "ui-structure",
                    title: "UI Structure",

                    content: {
                        text: "Frontend is what users see and interact with in the browser."
                    }
                },

                {
                    id: "frontend-review",
                    title: "HTML + CSS Review",

                    content: {
                        text: "Frontend development combines structure (HTML) and styling (CSS)."
                    }
                }
            ]
        },

        {
            id: "backend",
            title: "Backend Basics",

            lessons: [
                {
                    id: "server-intro",
                    title: "What is a Server?",

                    content: {
                        text: "A server processes requests and returns data to the user."
                    }
                },

                {
                    id: "apis",
                    title: "APIs Introduction",

                    content: {
                        text: "APIs allow communication between frontend and backend systems."
                    }
                }
            ]
        }
    ]
}

};
