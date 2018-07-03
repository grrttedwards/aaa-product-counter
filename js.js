var seen = new Set();

function addAmmo () {
    var name = document.getElementById("add_name").value;
    if (seen.has(name)) return;

    seen.add(name);

    
    var ammos = document.getElementById("ammos");

    var newAmmo = document.createElement("LI");

    var newName = document.createElement("SPAN");
    newName.style = "width: 150px; display: inline-block;";
    newName.innerText = name;

    var count = document.createElement("SPAN");
    count.style = `width: 50px; display: inline-block;`
    count.setAttribute(`id`, `_${name}_count`);
    count.innerText = 0;

    var addOneButton = document.createElement("BUTTON");
    addOneButton.style = `margin-right: 10px;`;
    addOneButton.setAttribute("id", `_${name}_addOne_button`);
    addOneButton.setAttribute(`onclick`, `addOne(_${name}_count)`);
    addOneButton.innerText = "Add 1";

    var addCount = document.createElement("INPUT");
    addCount.style = `margin-right: 10px; width: 30px;`
    addCount.setAttribute(`id`, `_${name}_addCount`);
    addCount.value = 0;

    var addCountButton = document.createElement("BUTTON");
    addCountButton.style = `margin-right: 5px;`;
    addCountButton.setAttribute("id", `_${name}_addCount_button`);
    addCountButton.setAttribute(`onclick`, `changeValue(_${name}_addCount)`);
    addCountButton.innerText = "+ X";

    var subCountButton = document.createElement("BUTTON");
    subCountButton.style = `margin-right: 50px;`;
    subCountButton.setAttribute("id", `_${name}_subCount_button`);
    subCountButton.setAttribute(`onclick`, `changeValue(_${name}_addCount, true)`);
    subCountButton.innerText = "- X";

    newAmmo.appendChild(newName);
    newAmmo.appendChild(count);
    newAmmo.appendChild(addOneButton);
    newAmmo.appendChild(addCount);
    newAmmo.appendChild(addCountButton);
    newAmmo.appendChild(subCountButton);

    ammos.appendChild(newAmmo);
}

function addOne (to) {
    addX(to, 1);
}

function changeValue (to, sign) {
    var name = to.id.split("_")[1];
    var counter = document.getElementById(`_${name}_count`);
    var valueToAdd = parseInt(document.getElementById(`_${name}_addCount`).value);
    if (valueToAdd) {
        if (sign) addX(counter, -valueToAdd);
        else addX(counter, valueToAdd);
    }
}

function addX (to, x) {
    var curVal = parseInt(to.innerText);
    console.log(`Changed ${to.id} from ${curVal} to ${curVal + x}`)
    to.innerText = curVal + x;
}
