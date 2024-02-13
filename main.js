document.addEventListener("DOMContentLoaded", () => {
    const partyListElement = document.getElementById("partyList");
    const partyFormElement = document.getElementById("partyForm");

    const API_ENDPOINT_URL = "https://cors-anywhere.herokuapp.com/https://example.com/api/events"; // Replace with your actual API endpoint URL

    // Function to fetch and render party data
    const fetchAndRenderParties = async () => {
        try {
            // Fetch parties from the API using CORS Anywhere as a proxy
            const response = await fetch(API_ENDPOINT_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const parties = await response.json();

            // Clear existing party list
            partyListElement.innerHTML = "";

            // Render each party in the list
            parties.forEach(party => renderParty(party));
        } catch (error) {
            console.error("Error fetching parties:", error);
        }
    };

    // Function to render a single party in the list
    const renderParty = (party) => {
        const partyItem = document.createElement("div");
        partyItem.innerHTML = `
            <p>Name: ${party.name}</p>
            <p>Date: ${party.date}</p>
            <p>Time: ${party.time}</p>
            <p>Location: ${party.location}</p>
            <p>Description: ${party.description}</p>
            <button onclick="deleteParty(${party.id})">Delete</button>
        `;
        partyListElement.appendChild(partyItem);
    };

    // Function to delete a party
    const deleteParty = async (partyId) => {
        try {
            // Send delete request to the API
            await fetch(`${API_ENDPOINT_URL}/${partyId}`, { method: "DELETE" });

            // Fetch and render updated party list
            fetchAndRenderParties();
        } catch (error) {
            console.error("Error deleting party:", error);
        }
    };

    // Event listener for form submission
    partyFormElement.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Get form data
        const formData = new FormData(partyFormElement);
        const partyData = {
            name: formData.get("name"),
            date: formData.get("date"),
            time: formData.get("time"),
            location: formData.get("location"),
            description: formData.get("description"),
        };

        try {
            // Send post request to add a new party
            await fetch(API_ENDPOINT_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(partyData),
            });

            // Fetch and render updated party list
            fetchAndRenderParties();

            // Clear the form
            partyFormElement.reset();
        } catch (error) {
            console.error("Error adding new party:", error);
        }
    });

    // Initial fetch and render
    fetchAndRenderParties();
});
