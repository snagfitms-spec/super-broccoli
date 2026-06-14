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
                    title: "What is HTML?"
                },
                {
                    id: "basic-structure",
                    title: "Basic Structure of a Web Page"
                },
                {
                    id: "html-tags",
                    title: "HTML Tags Overview"
                }
            ]
        },

        {
            id: "html-elements",
            title: "HTML Elements",

            lessons: [
                {
                    id: "headings-paragraphs",
                    title: "Headings & Paragraphs"
                },
                {
                    id: "links-images",
                    title: "Links & Images"
                },
                {
                    id: "lists-tables",
                    title: "Lists & Tables"
                }
            ]
        },

        {
            id: "css-basics",
            title: "CSS Basics",

            lessons: [
                {
                    id: "colors-fonts",
                    title: "Colors & Fonts"
                },
                {
                    id: "spacing-padding",
                    title: "Spacing & Padding"
                },
                {
                    id: "css-selectors",
                    title: "CSS Selectors"
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
                { id: "variables", title: "Variables" },
                { id: "datatypes", title: "Data Types" },
                { id: "operators", title: "Operators" }
            ]
        },

        {
            id: "js-logic",
            title: "Functions & Logic",

            lessons: [
                { id: "functions", title: "Functions" },
                { id: "conditions", title: "Conditions" },
                { id: "loops", title: "Loops" }
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
                { id: "ui-structure", title: "UI Structure" },
                { id: "frontend-review", title: "HTML + CSS Review" }
            ]
        },

        {
            id: "backend",
            title: "Backend Basics",

            lessons: [
                { id: "server-intro", title: "What is a Server?" },
                { id: "apis", title: "APIs Introduction" }
            ]
        }
    ]
}

};
