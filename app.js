class EntriesStore {
    _lines = []

    async init(numberOfLines) {
        await sleep(1000)
        for (let i = 0; i < numberOfLines; i++) {
            this._lines.push(this.generateRandomString())
        }
        await sleep(1000)
        return this
    }

    get() {
        return this._lines
    }

    getCount() {
        return count(this._lines)
    }

    generateRandomString()
    {
        return (Math.random() + 1).toString(36).substring(2)
    }
}

const entriesList = document.querySelector('#entriesTable')
const entryTemplate = document.querySelector('#entry').innerHTML
const scrollToFirst = document.querySelector('#scrollToFirst')
const scrollToLast = document.querySelector('#scrollToLast')
const controlButtons = document.querySelectorAll('.controlButtons')
const entryInput = document.querySelector('#entryInput')

const eStore = new EntriesStore()


fillList(eStore, entriesList, entryTemplate)

async function fillList(store, list, template) {
    await fillStore(store)
    const insert = eStore.get().map(function(item, index) {
        return renderTemplate(template, {
            id: index,
            text: item
        })
    }).join('')
    list.innerHTML = insert

    // Поставим листенеры на кнопки управления здесь, чтобы до этого они даже не думали работать
    controlButtons.forEach((button) => {
        button.addEventListener('click', function (e) {
            scrollToEntry(e)
        })
    })
}

async function fillStore(store) {
    await store.init(1000)
}

function renderTemplate(template, entry) {
    return template.replaceAll('{{ entry.id }}', entry.id).replaceAll('{{ entry.text }}', entry.text)
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function scrollToEntry(e) {
    let elementId = 'entry-'
    // Грязный хак. Вместе с реальными элементами у нас найдётся
    // и элемент шаблон. Поэтому отнимем от длины коллекции записей 2, а не 1
    // Ну, подумаем об элегантности попозже
    const entriesCount = document.querySelectorAll('.entry').length - 2

    switch (e.currentTarget.id) {
        case 'scrollToFirst':
            elementId += '0'
            break
        case 'scrollToLast':
            elementId += entriesCount
            break
        case 'scrollToInput':
            const inputValue = getInputValue(entriesCount)
            if (!inputValue) {
                return
            }
            elementId += inputValue
            break
    }

    const controlsHeight = controls.offsetHeight

    window.scrollTo({
        top: document.getElementById(elementId).offsetTop - controlsHeight,
        behavior: 'smooth'
    })
}

function getInputValue(maxValue) {
    const inputValue = entryInput.value

    if (isNaN(inputValue) || (inputValue > maxValue)) {
        alert('Либо вы ввели не число, либо оно больше количества строк на странице')
        return false
    }

    return Math.floor(inputValue)
}

