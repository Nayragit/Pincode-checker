function handleSubmit() {
    validatePincode();
    updateStep();
}

function updateStep() {
    const progressStep = document.getElementById('progressStep');
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');

    // Change "1 of 2" to "2 of 2"
    progressStep.innerHTML = "<span>2</span> of 2";

    // Update step bar: remove "active" from step1, add "active" to step2
    // step1.classList.remove('active');
    step2.classList.add('active');
}


function moveFocus(current, nextFieldID, prevFieldID) {
    if (current.value.length === 1 && nextFieldID) {
        document.getElementById(nextFieldID).focus();
    } else if (current.value.length === 0 && prevFieldID && event.key === 'Backspace') {
        document.getElementById(prevFieldID).focus();
    }
}

function validatePincode() {
    const pincode = Array.from({ length: 6 }, (_, i) => document.getElementById(`pincode${i + 1}`).value).join('');
    const confirmPincode = Array.from({ length: 6 }, (_, i) => document.getElementById(`confirm_pincode${i + 1}`).value).join('');
    const responseMessage = document.getElementById('responseMessage');

    if (pincode === confirmPincode && pincode.length === 6) {
        fetchPincodeInfo(pincode);
    } else {
        responseMessage.classList.remove('hidden');
        responseMessage.style.display = 'block';
        responseMessage.innerText = 'Pincodes do not match or are incomplete. Please try again.';
    }
}

async function fetchPincodeInfo(pincode) {
    const responseMessage = document.getElementById('responseMessage');
    try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await response.json();

        if (data[0].Status === "Success" && data[0].PostOffice.length > 0) {
            const postOffice = data[0].PostOffice[0];
            responseMessage.classList.remove('hidden');
            document.querySelectorAll('.input-container').forEach(container => {
                container.style.display = 'none'
            })
            responseMessage.style.display = 'block';
            responseMessage.innerHTML = `
                <strong>Success:</strong> ${postOffice.Name}, ${postOffice.District}, ${postOffice.State}, ${postOffice.Country}. 
                Delivery Status: ${postOffice.DeliveryStatus}`;
        } else {
            responseMessage.classList.remove('hidden');
            responseMessage.style.display = 'block';
            responseMessage.innerHTML = `<strong>Error:</strong> No data found for this pincode.`;
        }
    } catch (error) {
        responseMessage.classList.remove('hidden');
        responseMessage.style.display = 'block';
        responseMessage.innerHTML = `<strong>Error:</strong> Could not retrieve data. Please try again later.`;
    }
}