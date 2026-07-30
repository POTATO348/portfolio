(function() {
    const nameText = "Anjenel G. Delumen",
        degreeText = "Computer Science Graduated · Mobile Application Developer & IT Technical";
    const nameContainer = document.getElementById('typingName'),
        degreeContainer = document.getElementById('typingDegree');
    let nameIndex = 0,
        degreeIndex = 0,
        isErasingName = false,
        isErasingDegree = false;

    function typeName() {
        if (!isErasingName && nameIndex < nameText.length) {
            nameContainer.innerHTML = nameText.substring(0, nameIndex + 1) + '<span class="cursor-blink"></span>';
            nameIndex++;
            setTimeout(typeName, 80);
        } else if (!isErasingName && nameIndex === nameText.length) {
            nameContainer.innerHTML = nameText + '<span class="cursor-blink"></span>';
            setTimeout(() => { isErasingName = true;
                typeName(); }, 2000);
        } else if (isErasingName && nameIndex > 0) {
            nameContainer.innerHTML = nameText.substring(0, nameIndex - 1) + '<span class="cursor-blink"></span>';
            nameIndex--;
            setTimeout(typeName, 50);
        } else if (isErasingName && nameIndex === 0) {
            isErasingName = false;
            setTimeout(typeName, 500);
        }
    }

    function typeDegree() {
        if (!isErasingDegree && degreeIndex < degreeText.length) {
            degreeContainer.innerHTML = degreeText.substring(0, degreeIndex + 1) + '<span class="cursor-blink"></span>';
            degreeIndex++;
            setTimeout(typeDegree, 60);
        } else if (!isErasingDegree && degreeIndex === degreeText.length) {
            degreeContainer.innerHTML = degreeText + '<span class="cursor-blink"></span>';
            setTimeout(() => { isErasingDegree = true;
                typeDegree(); }, 1500);
        } else if (isErasingDegree && degreeIndex > 0) {
            degreeContainer.innerHTML = degreeText.substring(0, degreeIndex - 1) + '<span class="cursor-blink"></span>';
            degreeIndex--;
            setTimeout(typeDegree, 40);
        } else if (isErasingDegree && degreeIndex === 0) {
            isErasingDegree = false;
            setTimeout(typeDegree, 500);
        }
    }
    window.addEventListener('DOMContentLoaded', () => { setTimeout(() => { typeName();
            typeDegree(); }, 300); });
})();