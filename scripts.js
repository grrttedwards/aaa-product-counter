var url = window.location.href.split('/').slice(0, -1).join('/');
var productsFederalFile = url + "/products_federal.txt";
var productsCciSpeerFile = url + "/products_ccispeer.txt";

window.onload = function () {
    loadProducts(productsFederalFile, "federalproducts");
    loadProducts(productsCciSpeerFile, "ccispeerproducts");
    document.getElementById("add_name").addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            document.getElementById("add_button").click();
        }
    });
    changeBrand(document.getElementsByName("brand")[0]);
};

window.onbeforeunload = function (e) {
    e = e || window.event;
    return "Are you sure?";
};

function printPopulated() {
    var originalContents = document.body.innerHTML;
    var printContents = document.createElement("ul");
    document.getElementsByName("productlist").forEach( (productList) => {
        if (productList.style.display == "none") return;  // skip any hidden product list
        var products = productList.getElementsByTagName("li");
        for (var i = 0; i < products.length; i++) {
            var product = products[i];  // skip the first header element of the lists
            var count = product.getElementsByTagName("span")[1];
            if (count.innerText != "0") {  // the second span is the value field 
                var newLi = document.createElement("li");
                product.querySelectorAll("span").forEach( (element) => {
                    newLi.appendChild(element);
                });
                newLi.style = "border-bottom:1px dashed #000; width: 200px;"
                printContents.appendChild(newLi);
            }
        }
    });
    var header = document.getElementById("tableheader");
    document.body.innerHTML = "<h1>Product Count</h1>";
    document.body.appendChild(header);
    document.body.appendChild(printContents);
    window.print();
    document.body.innerHTML = originalContents;
}

function changeBrand ( e ) {
    document.getElementsByName("brand").forEach( (element) => {
        element.removeAttribute("checked");
    })
    e.setAttribute("checked", true);

    document.getElementsByName("productlist").forEach( (element) => {
        element.style.display = "none";
    })
    document.getElementById(e.value).style.display = "block";
}

function loadProducts( filename, container ) {
    console.log(`Loading ${filename}`);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var cont = document.getElementById(container);
            this.responseText.split('\n').sort().forEach((line) => {
                line = line.trim();
                if (!line) return;  // throw away potential blank lines
                cont = document.getElementById(container);
                cont.appendChild(getAmmoEntry(line));
            });
        }
    };
    xmlhttp.open("GET", filename, true);
    xmlhttp.send();
}

var seen = new Set();

function getAmmoEntry ( name ) {
    name = name.trim();  // remove whitespace from front and back, for sanity
    if (seen.has(name)) return;
    seen.add(name);
    
    var newAmmo = document.createElement("LI");
    newAmmo.setAttribute("name", "count");

    var newName = document.createElement("SPAN");
    newName.style = "width: 150px; display: inline-block;";
    newName.style.fontFamily = "monospace";
    newName.style.fontSize = 18;
    newName.innerText = name;

    name = name.replace(/ /g, "_");  // replace spaces with safer characters

    var count = document.createElement("SPAN");
    count.style = `width: 50px; display: inline-block;`;
    count.setAttribute(`id`, `_${name}_count`);
    count.innerText = 0;

    var addOneButton = document.createElement("BUTTON");
    addOneButton.style = `margin-right: 20px; text-align: center;`;
    addOneButton.setAttribute("id", `_${name}_addOne_button`);
    addOneButton.setAttribute(`onclick`, `addOne(_${name}_count)`);
    addOneButton.innerText = "+ 1";

    var addCount = document.createElement("INPUT");
    addCount.style = `margin-right: 10px; width: 30px;`;
    addCount.setAttribute(`id`, `_${name}_addCount`);
    addCount.value = "";

    var addCountButton = document.createElement("BUTTON");
    addCountButton.style = `margin-right: 5px; text-align: center;`;
    addCountButton.setAttribute("id", `_${name}_addCount_button`);
    addCountButton.setAttribute(`onclick`, `changeValue(_${name}_addCount)`);
    addCountButton.style.width = "25px";
    addCountButton.innerText = "+";

    addCount.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            addCountButton.click();
        }
    });

    var subCountButton = document.createElement("BUTTON");
    subCountButton.style = `text-align: center;`;
    subCountButton.setAttribute("id", `_${name}_subCount_button`);
    subCountButton.setAttribute(`onclick`, `changeValue(_${name}_addCount, true)`);
    subCountButton.style.width = "25px";
    subCountButton.innerText = "-";

    newAmmo.appendChild(newName);
    newAmmo.appendChild(count);
    newAmmo.appendChild(addOneButton);
    newAmmo.appendChild(addCount);
    newAmmo.appendChild(addCountButton);
    newAmmo.appendChild(subCountButton);
    
    return newAmmo;
}

function addProduct () {
    var name = document.getElementById("add_name").value;
    if (!name) return;
    document.getElementById("add_name").value = "";
    
    var newAmmo = getAmmoEntry(name);
    if (!newAmmo) return;
    
    var brands = document.getElementsByName("brand");
    var product;
    brands.forEach(( brand ) => {
       if (brand.checked) {
           product = document.getElementById(brand.value);
       }
    });

    product.appendChild(newAmmo);
}

function addOne (to) {
    addX(to, 1);
}

function changeValue (to, sign) {
    var name = to.id.split("_")[1];
    var counter = document.getElementById(`_${name}_count`);
    var valueToAdd = parseInt(document.getElementById(`_${name}_addCount`).value);
    document.getElementById(`_${name}_addCount`).value = "" ;
    if (valueToAdd) {
        if (sign) addX(counter, -valueToAdd);
        else addX(counter, valueToAdd);
    }
}

function addX (to, x) {
    var curVal = parseInt(to.innerText);
    console.log(`Changed ${to.id} by ${x} from ${curVal} to ${curVal + x}`);
    to.innerText = curVal + x;
}
