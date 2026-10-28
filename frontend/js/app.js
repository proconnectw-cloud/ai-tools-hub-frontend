const API_URL = "https://ai-tools-hub-backend-bnsg.onrender.com";

const toolsContainer = document.getElementById("tools");
const searchInput = document.getElementById("search");
const categoryButtons = document.querySelectorAll(".category-btn");
const toolForm = document.getElementById("tool-form");


let allTools = [];
let activeCategory = "all";


async function loadTools() {
    const response = await fetch(`${API_URL}/tools`);
    allTools = await response.json();


    showTools(allTools);
}


function showTools(toolList) {
    toolsContainer.innerHTML = "";


    if (toolList.length === 0) {
        toolsContainer.innerHTML = "<p>No AI tools found.</p>";
        return;
    }


    toolList.forEach(tool => {
        const card = document.createElement("div");
        card.className = "tool-card";


        card.innerHTML = `
            <h3>${tool.name}</h3>
            <span class="category">${tool.category}</span>
            <p>${tool.description}</p>
            <a href="${tool.link}" target="_blank">Visit Tool</a>
        `;


        toolsContainer.appendChild(card);
    });
}


function filterTools() {
    const searchText = searchInput.value.toLowerCase();


    const filtered = allTools.filter(tool => {
        const matchesSearch =
            tool.name.toLowerCase().includes(searchText) ||
            tool.description.toLowerCase().includes(searchText);


        const matchesCategory =
            activeCategory === "all" ||
            tool.category === activeCategory;


        return matchesSearch && matchesCategory;
    });


    showTools(filtered);
}


searchInput.addEventListener("input", filterTools);


categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
        document.querySelector(".category-btn.active")
            .classList.remove("active");


        button.classList.add("active");
        activeCategory = button.dataset.category;


        filterTools();
    });
});


toolForm.addEventListener("submit", async (event) => {
    event.preventDefault();


    const name = document.getElementById("tool-name").value;
    const category = document.getElementById("tool-category").value;
    const description = document.getElementById("tool-description").value;
    const link = document.getElementById("tool-link").value;


    const response = await fetch(
        `${API_URL}/tools?name=` +
        encodeURIComponent(name) +
        "&category=" +
        encodeURIComponent(category) +
        "&description=" +
        encodeURIComponent(description) +
        "&link=" +
        encodeURIComponent(link),
        {
            method: "POST"
        }
    );


    if (response.ok) {
        toolForm.reset();
        loadTools();
        alert("Tool added successfully!");
    } else {
        alert("Failed to add tool.");
    }
});


loadTools();