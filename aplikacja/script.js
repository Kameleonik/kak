function calculate() {
    // Pobierz wartości z formularza
    const power = parseFloat(document.getElementById('power').value);
    const hours = parseFloat(document.getElementById('hours').value);
    const days = parseFloat(document.getElementById('days').value);
    const price = parseFloat(document.getElementById('price').value);
    
    // Sprawdź czy wszystkie pola są wypełnione
    if (!power || !hours || !days || !price) {
        alert('Proszę wypełnić wszystkie pola!');
        return;
    }
    
    // Sprawdź czy wartości są poprawne
    if (power <= 0 || hours < 0 || hours > 24 || days <= 0 || price <= 0) {
        alert('Proszę wprowadzić poprawne wartości!');
        return;
    }
    
    // Obliczenia
    const energyConsumptionKWh = (power * hours * days) / 1000; // kWh
    const cost = energyConsumptionKWh * price; // zł
    const monthlyCost = (power * hours * 30 * price) / 1000; // zł miesięcznie
    const yearlyCost = (power * hours * 365 * price) / 1000; // zł rocznie
    
    // Wyświetl wyniki
    document.getElementById('energy-consumption').textContent = 
        `${energyConsumptionKWh.toFixed(2)} kWh`;
    document.getElementById('cost').textContent = 
        `${cost.toFixed(2)} zł`;
    document.getElementById('monthly-cost').textContent = 
        `${monthlyCost.toFixed(2)} zł`;
    document.getElementById('yearly-cost').textContent = 
        `${yearlyCost.toFixed(2)} zł`;
    
    // Pokaż sekcję z wynikami
    document.getElementById('results').classList.remove('hidden');
    
    // Przewiń do wyników
    document.getElementById('results').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Dodaj obsługę klawisza Enter
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculate();
            }
        });
    });
});

// Dodaj walidację w czasie rzeczywistym
document.getElementById('hours').addEventListener('input', function() {
    const value = parseFloat(this.value);
    if (value > 24) {
        this.value = 24;
    }
    if (value < 0) {
        this.value = 0;
    }
});

document.getElementById('power').addEventListener('input', function() {
    const value = parseFloat(this.value);
    if (value < 0) {
        this.value = 0;
    }
});

document.getElementById('days').addEventListener('input', function() {
    const value = parseFloat(this.value);
    if (value < 1) {
        this.value = 1;
    }
});

document.getElementById('price').addEventListener('input', function() {
    const value = parseFloat(this.value);
    if (value < 0) {
        this.value = 0;
    }
});