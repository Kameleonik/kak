// Globalne zmienne
let lastCalculation = null;

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
    
    // Zapisz ostatnie obliczenie
    lastCalculation = {
        deviceName: document.getElementById('device-name').value || `Urządzenie ${power}W`,
        power: power,
        hours: hours,
        days: days,
        price: price,
        energyConsumption: energyConsumptionKWh,
        cost: cost,
        monthlyCost: monthlyCost,
        yearlyCost: yearlyCost,
        timestamp: new Date().toLocaleString('pl-PL')
    };
    
    // Wyświetl wyniki
    document.getElementById('energy-consumption').textContent = 
        `${energyConsumptionKWh.toFixed(2)} kWh`;
    document.getElementById('cost').textContent = 
        `${cost.toFixed(2)} zł`;
    document.getElementById('monthly-cost').textContent = 
        `${monthlyCost.toFixed(2)} zł`;
    document.getElementById('yearly-cost').textContent = 
        `${yearlyCost.toFixed(2)} zł`;
    
    // Pokaż sekcję z wynikami i włącz przycisk zapisu
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('save-btn').disabled = false;
    
    // Przewiń do wyników
    document.getElementById('results').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

function saveCalculation() {
    if (!lastCalculation) {
        alert('Najpierw wykonaj obliczenie!');
        return;
    }
    
    // Pobierz zapisane obliczenia z localStorage
    let savedCalculations = JSON.parse(localStorage.getItem('powerCalculations')) || [];
    
    // Dodaj nowe obliczenie
    savedCalculations.push({
        ...lastCalculation,
        id: Date.now() // unikalne ID
    });
    
    // Zapisz w localStorage
    localStorage.setItem('powerCalculations', JSON.stringify(savedCalculations));
    
    // Odśwież listę
    displaySavedCalculations();
    
    // Wyłącz przycisk zapisu
    document.getElementById('save-btn').disabled = true;
    
    alert('Obliczenie zostało zapisane!');
}

function displaySavedCalculations() {
    const savedCalculations = JSON.parse(localStorage.getItem('powerCalculations')) || [];
    const listContainer = document.getElementById('calculations-list');
    const summaryContainer = document.getElementById('summary');
    const clearBtn = document.getElementById('clear-btn');
    
    if (savedCalculations.length === 0) {
        listContainer.innerHTML = '<p class="no-calculations">Brak zapisanych obliczeń</p>';
        summaryContainer.style.display = 'none';
        clearBtn.style.display = 'none';
        return;
    }
    
    // Wyświetl obliczenia
    listContainer.innerHTML = savedCalculations.map(calc => `
        <div class="calculation-item">
            <div class="calculation-header">
                <span class="device-name">${calc.deviceName}</span>
                <button class="delete-btn" onclick="deleteCalculation(${calc.id})">🗑️</button>
            </div>
            <div class="calculation-details">
                <span>Moc: <strong>${calc.power}W</strong></span>
                <span>Godziny: <strong>${calc.hours}h/dzień</strong></span>
                <span>Okres: <strong>${calc.days} dni</strong></span>
                <span>Cena: <strong>${calc.price} zł/kWh</strong></span>
                <span>Zużycie: <strong>${calc.energyConsumption.toFixed(2)} kWh</strong></span>
                <span>Koszt miesięczny: <strong>${calc.monthlyCost.toFixed(2)} zł</strong></span>
            </div>
            <small style="color: #999; margin-top: 10px; display: block;">Zapisano: ${calc.timestamp}</small>
        </div>
    `).join('');
    
    // Oblicz sumy
    const totalMonthly = savedCalculations.reduce((sum, calc) => sum + calc.monthlyCost, 0);
    const totalYearly = savedCalculations.reduce((sum, calc) => sum + calc.yearlyCost, 0);
    const totalEnergy = savedCalculations.reduce((sum, calc) => sum + (calc.power * calc.hours * 30 / 1000), 0);
    
    // Wyświetl podsumowanie
    document.getElementById('total-energy').textContent = `${totalEnergy.toFixed(2)} kWh`;
    document.getElementById('total-monthly').textContent = `${totalMonthly.toFixed(2)} zł`;
    document.getElementById('total-yearly').textContent = `${totalYearly.toFixed(2)} zł`;
    
    summaryContainer.style.display = 'block';
    clearBtn.style.display = 'block';
}

function deleteCalculation(id) {
    if (!confirm('Czy na pewno chcesz usunąć to obliczenie?')) {
        return;
    }
    
    let savedCalculations = JSON.parse(localStorage.getItem('powerCalculations')) || [];
    savedCalculations = savedCalculations.filter(calc => calc.id !== id);
    localStorage.setItem('powerCalculations', JSON.stringify(savedCalculations));
    
    displaySavedCalculations();
}

function clearAllCalculations() {
    if (!confirm('Czy na pewno chcesz usunąć wszystkie zapisane obliczenia?')) {
        return;
    }
    
    localStorage.removeItem('powerCalculations');
    displaySavedCalculations();
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
    
    // Załaduj zapisane obliczenia przy starcie
    displaySavedCalculations();
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