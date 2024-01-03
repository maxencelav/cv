import './style.css'
import data from './metadata.json';

window.addEventListener('DOMContentLoaded', () => {
    // list all the entries in the data json
    const keys = Object.keys(data);
    console.log(keys);

    keys.forEach(key => {
        let catContainer = document.querySelector("#" + key);
        let cat = data[key];

        console.log(key, typeof cat)
        cat.forEach(item => {

            if (typeof item === "string") {
                let itemContainer = document.createElement("span");
                itemContainer.classList.add("item");
                itemContainer.innerText = item;
                catContainer.appendChild(itemContainer);
                return;
            }

            let itemContainer = document.createElement("div");
            itemContainer.classList.add("item");

            // HEADERS
            if (item.name) {
                let itemTitle = document.createElement("h3");
                itemTitle.classList.add("name");
                itemTitle.innerText = item.name;
                itemContainer.appendChild(itemTitle);
            }
            if (item.company) {
                let itemCompany = document.createElement("h3");
                itemCompany.classList.add("company");
                itemCompany.innerText = item.company;
                itemContainer.appendChild(itemCompany);
            }
            if (item.institution) {
                let itemInstitution = document.createElement("h3");
                itemInstitution.classList.add("institution");
                itemInstitution.innerText = item.institution;
                itemContainer.appendChild(itemInstitution);
            }


            // SUBHEADERS
            if (item.issuer) {
                let itemIssuer = document.createElement("p");
                itemIssuer.classList.add("issuer");
                itemIssuer.innerText = item.issuer;
                itemContainer.appendChild(itemIssuer);
            }
            if (item.title) {
                let itemTitle = document.createElement("p");
                itemTitle.classList.add("title");
                itemTitle.innerText = item.title;
                itemContainer.appendChild(itemTitle);
            }
            if (item.description) {
                let itemDescription = document.createElement("p");
                itemDescription.classList.add("description");
                itemDescription.innerText = item.description;
                itemContainer.appendChild(itemDescription);
            }
            if (item.position) {
                let itemPosition = document.createElement("p");
                itemPosition.classList.add("position");
                itemPosition.innerText = item.position;
                itemContainer.appendChild(itemPosition);
            }


            // ASIDE
            if (item.date) {
                let itemDate = document.createElement("p");
                itemDate.classList.add("date");
                itemDate.innerText = item.date;
                itemContainer.appendChild(itemDate);
            }

            // OTHER
            if (item.summary) {
                let itemSummary = document.createElement("p");
                itemSummary.classList.add("summary");
                itemSummary.innerHTML = item.summary;
                itemContainer.appendChild(itemSummary);
            }
            if (item.url) {
                let itemUrl = document.createElement("a");
                itemUrl.classList.add("url");
                itemUrl.innerText = item.url;
                itemUrl.href = item.url;
                itemUrl.target = "_blank";
                itemContainer.appendChild(itemUrl);
            }
        
            
            // add the item container to the category container
            catContainer.appendChild(itemContainer);
        });

    });

});



