# ⚛️ Nuclear Script — 3D-демо електростанцій

Інтерактивні Three.js-візуалізації атомної, теплової, сонячної, гідро-, вітроелектростанцій, ядерного реактора та загальної будови турбіни з генератором, створені для навчальних цілей.

## Демо-сцени

| Файл | Назва | Опис |
|------|-------|------|
| [`plant-basic.html`](plant-basic.html) | АЕС — базова сцена | Реакторний корпус, дві градирні з анімованою парою, машинний зал, димова труба, ставок-охолоджувач, допоміжні будівлі, периметровий паркан, підписи до головних об'єктів |
| [`plant-extended.html`](plant-extended.html) | АЕС — розширена сцена | Усе з базової сцени + підстанція з трансформаторами та шинами, адмінкорпус, склад, ЛЕП, дороги, ліхтарі, додаткові підписи |
| [`reactor-cutaway.html`](reactor-cutaway.html) | Реактор — розріз | Спрощена 3D-модель PWR-реактора у розрізі: корпус реактора, теплоносій, активна зона, паливні та керуючі стрижні, CSS2D-підписи, перемикачі видимості шарів |
| [`thermal-plant.html`](thermal-plant.html) | Теплова електростанція | Котельний цех, турбінний зал, димові труби, вугільний склад, ставок технічної води та підстанція з підписами |
| [`solar-plant.html`](solar-plant.html) | Сонячна електростанція | Поле сонячних панелей, інверторний майданчик, сервісний модуль, накопичувач енергії та підстанція з підписами |
| [`hydro-plant.html`](hydro-plant.html) | Гідроелектростанція | Гребля, водосховище, скид води, машинний зал, водоводи та вузол видачі потужності з підписами |
| [`wind-plant.html`](wind-plant.html) | Вітрова електростанція | Вітропарк, сервісний модуль, кабельна траса, підстанція і навчальний макет гондоли з генератором |
| [`turbine-generator.html`](turbine-generator.html) | Турбіна і генератор | Спрощений навчальний розріз турбіни та генератора: лопатки, вал, ротор, статор, обмотки й клемний вивід |

Відкрийте [`index.html`](index.html) для навігаційної сторінки зі списком усіх сцен.

## Керування

| Дія | Пристрій |
|-----|---------|
| Обертання | ЛКМ (drag) |
| Масштаб | Колесо миші / pinch |
| Панорама | ПКМ (drag) / два пальці |
| Показати / приховати підписи | Чекбокс `Підписи` у сценах електростанцій |
| Скинути камеру | Кнопка `⟳ Скинути камеру` |

## Запуск

### Встановлення залежностей

```bash
npm install
```

### Режим розробки

```bash
npm run dev
```

Після запуску відкрийте адресу, яку покаже Vite (типово <http://localhost:5173>). Усі демо працюють як multi-page app:

- `/`
- `/plant-basic.html`
- `/plant-extended.html`
- `/reactor-cutaway.html`
- `/thermal-plant.html`
- `/solar-plant.html`
- `/hydro-plant.html`
- `/wind-plant.html`
- `/turbine-generator.html`

### Production build

```bash
npm run build
```

Зібрані файли з'являться в директорії `dist/`.

## Технологічний стек

- [Three.js](https://threejs.org/) `0.160.0`
- [Vite](https://vitejs.dev/) — локальна збірка та dev server без CDN-імпортів
- `OrbitControls` — навігація камерою
- `CSS2DRenderer` — HTML-підписи у 3D-просторі
- Чистий HTML/CSS/JS з ES-модулями

## Структура проєкту

```text
nuclear_script/
├── index.html
├── plant-basic.html
├── plant-extended.html
├── reactor-cutaway.html
├── thermal-plant.html
├── solar-plant.html
├── hydro-plant.html
├── wind-plant.html
├── turbine-generator.html
├── package.json
├── vite.config.js
├── js/
│   ├── common/
│   │   ├── instancing.js
│   │   ├── labels.js
│   │   ├── materials.js
│   │   └── setup.js
│   └── scenes/
│       ├── hydro-plant.js
│       ├── plant-basic.js
│       ├── plant-extended.js
│       ├── plant-shared.js
│       ├── reactor-cutaway.js
│       ├── solar-plant.js
│       ├── thermal-plant.js
│       ├── turbine-generator.js
│       └── wind-plant.js
└── README.md
```

## Що вже покращено

- Додано окремі сторінки-демо для ТЕС, СЕС, ГЕС і ВЕС
- Додано окрему навчальну сцену із загальною будовою турбіни та генератора
- Нові сцени теж використовують спільний Three.js bootstrap, централізовані матеріали й CSS2D-підписи

- Спільний Three.js bootstrap винесено в `js/common/setup.js`
- Матеріали централізовано в `js/common/materials.js`
- Загальні helper'и для CSS2D-підписів винесено в `js/common/labels.js`
- Повторювані об'єкти оптимізовано через `THREE.InstancedMesh`:
  - паркани
  - ліхтарі
  - структурні елементи опор ЛЕП
- CDN-імпорти прибрано; сцени працюють через локальні npm-залежності
- До базової та розширеної сцен додано підписи до ключових об'єктів

## Перевірка

Перевірено локально:

```bash
npm run build
```

Також вручну перевірено рендеринг сторінок `index.html`, `plant-basic.html`, `plant-extended.html`, `reactor-cutaway.html`, `thermal-plant.html`, `solar-plant.html`, `hydro-plant.html`, `wind-plant.html` і `turbine-generator.html` через Vite dev server.

## Ліцензія

Навчальний/демонстраційний проєкт. Використання Three.js підпадає під [MIT License](https://github.com/mrdoob/three.js/blob/dev/LICENSE).
