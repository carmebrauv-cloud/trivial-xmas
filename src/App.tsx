import { useState, useEffect } from "react";


const COLORS = {
  red: "#B51220",
  green: "#0F3F2A",
  gold: "#D4AF37",
  white: "#F7F7F7",
  iceBlue: "#8EC5FC",
};

type Option = {
  text: string;
  correct: boolean;
};

type Question = {
  question: string;
  options: Option[];
};

type CategoryKey = "tradiciones" | "comida" | "villancicos" | "cine" | "curiosidades";

// Sonidos globales (se sirven desde /public)
const clickSound = new Audio("/sounds/click.mp3");
const correctSound = new Audio("/sounds/correct.mp3");
const wrongSound = new Audio("/sounds/wrong.wav");
const bgMusic = new Audio("/sounds/bg-music.mp3");

bgMusic.loop = true;
bgMusic.volume = 0.4;

const categories: { key: CategoryKey; label: string }[] = [
  { key: "tradiciones", label: "🎁 Tradiciones Navideñas" },
  { key: "comida", label: "🍪 Comida y Dulces" },
  { key: "villancicos", label: "🎶 Villancicos y Música" },
  { key: "cine", label: "🎬 Cine Navideño" },
  { key: "curiosidades", label: "❄ Curiosidades Invernales" },
];

const questionsDB: Record<CategoryKey, Question[]> = {
  tradiciones: [
    {
      question: "¿En qué país se popularizó primero la tradición del árbol de Navidad moderno?",
      options: [
        { text: "Alemania", correct: true },
        { text: "Italia", correct: false },
        { text: "Francia", correct: false },
        { text: "Reino Unido", correct: false },
      ],
    },
    {
      question: "¿Qué se suele colocar en la parte más alta del árbol de Navidad?",
      options: [
        { text: "Una estrella", correct: true },
        { text: "Una campana", correct: false },
        { text: "Un calcetín", correct: false },
        { text: "Un bastón de caramelo", correct: false },
      ],
    },
    {
      question: "¿Qué celebra la Navidad en la tradición cristiana?",
      options: [
        { text: "El nacimiento de Jesús", correct: true },
        { text: "La llegada de los Reyes Magos", correct: false },
        { text: "El inicio del año nuevo", correct: false },
        { text: "El fin del invierno", correct: false },
      ],
    },
    {
      question: "¿Qué país es famoso por celebrar San Nicolás el 6 de diciembre?",
      options: [
        { text: "Países Bajos", correct: true },
        { text: "Brasil", correct: false },
        { text: "Argentina", correct: false },
        { text: "Japón", correct: false },
      ],
    },
    {
      question:
        "¿Cuál es el nombre tradicional del personaje que reparte regalos en España y Latinoamérica?",
      options: [
        { text: "Papá Noel", correct: false },
        { text: "Santa Claus", correct: false },
        { text: "Los Reyes Magos", correct: true },
        { text: "Elfos de invierno", correct: false },
      ],
    },
    {
      question: "¿Qué objeto se cuelga en las puertas como adorno navideño tradicional?",
      options: [
        { text: "Una corona de ramas verdes", correct: true },
        { text: "Un muñeco de nieve", correct: false },
        { text: "Un reno de peluche", correct: false },
        { text: "Un bastón gigante", correct: false },
      ],
    },
    {
      question: "¿En qué fecha se suele montar el Belén o pesebre en muchos hogares?",
      options: [
        { text: "A principios de diciembre", correct: true },
        { text: "El 31 de diciembre", correct: false },
        { text: "El 6 de enero", correct: false },
        { text: "Solo el 24 de diciembre", correct: false },
      ],
    },
    {
      question: "¿Qué se celebra el 6 de enero en muchos países hispanohablantes?",
      options: [
        { text: "El Día de Reyes", correct: true },
        { text: "La Nochebuena", correct: false },
        { text: "La Nochevieja", correct: false },
        { text: "El Día de los Inocentes", correct: false },
      ],
    },
    {
      question:
        "¿Qué significado tiene tradicionalmente la estrella colocada en el árbol o el Belén?",
      options: [
        { text: "La estrella de Belén", correct: true },
        { text: "Un copo de nieve", correct: false },
        { text: "El sol de invierno", correct: false },
        { text: "Un cometa decorativo", correct: false },
      ],
    },
    {
      question: "¿Qué se suele hacer en muchos países justo a medianoche en Nochebuena?",
      options: [
        { text: "Abrir los regalos", correct: true },
        { text: "Tirar confeti de colores", correct: false },
        { text: "Quemar el árbol", correct: false },
        { text: "Salir a hacer deporte", correct: false },
      ],
    },
  ],
  comida: [
    {
      question:
        "¿Qué dulce navideño típico español se elabora principalmente con almendra y miel?",
      options: [
        { text: "Turrón", correct: true },
        { text: "Mantecados", correct: false },
        { text: "Roscón de Reyes", correct: false },
        { text: "Panettone", correct: false },
      ],
    },
    {
      question: "¿De qué país es originario el panettone navideño?",
      options: [
        { text: "Italia", correct: true },
        { text: "Suecia", correct: false },
        { text: "Irlanda", correct: false },
        { text: "Canadá", correct: false },
      ],
    },
    {
      question: "¿Qué fruta confitada suele llevar el Roscón de Reyes?",
      options: [
        { text: "Frutas escarchadas de colores", correct: true },
        { text: "Solo manzana", correct: false },
        { text: "Solo plátano", correct: false },
        { text: "Solo fresas", correct: false },
      ],
    },
    {
      question:
        "¿Qué bebida caliente y especiada es típica en los mercados navideños europeos?",
      options: [
        { text: "Vino caliente", correct: true },
        { text: "Limonada fría", correct: false },
        { text: "Café helado", correct: false },
        { text: "Té con hielo", correct: false },
      ],
    },
    {
      question:
        "¿Qué pescado es muy típico en la cena de Nochebuena en muchos países europeos?",
      options: [
        { text: "Bacalao", correct: true },
        { text: "Atún", correct: false },
        { text: "Salmón crudo", correct: false },
        { text: "Sardinas fritas", correct: false },
      ],
    },
    {
      question: "¿Qué fruto seco es protagonista en muchos dulces navideños?",
      options: [
        { text: "Almendra", correct: true },
        { text: "Cacahuete salado", correct: false },
        { text: "Girasol", correct: false },
        { text: "Pistacho solo", correct: false },
      ],
    },
    {
      question: "¿Qué postre redondo y relleno se suele comer el 6 de enero en España?",
      options: [
        { text: "Roscón de Reyes", correct: true },
        { text: "Tarta de queso", correct: false },
        { text: "Flan de huevo", correct: false },
        { text: "Brownie", correct: false },
      ],
    },
    {
      question:
        "¿Qué dulce navideño británico se prepara con frutos secos y se flamea con alcohol?",
      options: [
        { text: "Christmas pudding", correct: true },
        { text: "Crème brûlée", correct: false },
        { text: "Baklava", correct: false },
        { text: "Cheesecake", correct: false },
      ],
    },
    {
      question: "¿Cuál de estos dulces se suele asociar a la Navidad en Alemania?",
      options: [
        { text: "Stollen", correct: true },
        { text: "Macaron", correct: false },
        { text: "Pastel de luna", correct: false },
        { text: "Churros", correct: false },
      ],
    },
    {
      question: "¿Qué acompañamiento dulce se deja a veces para Papá Noel junto al árbol?",
      options: [
        { text: "Galletas y leche", correct: true },
        { text: "Pizza y refresco", correct: false },
        { text: "Palomitas y zumo", correct: false },
        { text: "Helado y café", correct: false },
      ],
    },
  ],
  villancicos: [
    {
      question: "¿Qué villancico habla de peces que beben en el río?",
      options: [
        { text: "Los peces en el río", correct: true },
        { text: "Campana sobre campana", correct: false },
        { text: "Ay del chiquirritín", correct: false },
        { text: "Dime Niño, ¿de quién eres?", correct: false },
      ],
    },
    {
      question: "¿Qué villancico repite la frase “Belén, campanas de Belén”?",
      options: [
        { text: "Campana sobre campana", correct: true },
        { text: "Noche de paz", correct: false },
        { text: "El tamborilero", correct: false },
        { text: "Adeste Fideles", correct: false },
      ],
    },
    {
      question: "¿Cómo se llama en español el villancico “Silent Night”?",
      options: [
        { text: "Noche de paz", correct: true },
        { text: "Noche de luz", correct: false },
        { text: "Noche estrellada", correct: false },
        { text: "Noche blanca", correct: false },
      ],
    },
    {
      question: "¿Qué instrumento destaca en el villancico “El tamborilero”?",
      options: [
        { text: "El tambor", correct: true },
        { text: "El violín", correct: false },
        { text: "La trompeta", correct: false },
        { text: "La flauta", correct: false },
      ],
    },
    {
      question:
        "¿Dónde se canta tradicionalmente un coro de villancicos llamado “Christmas carols”?",
      options: [
        { text: "En países anglosajones", correct: true },
        { text: "Solo en Asia", correct: false },
        { text: "Solo en África", correct: false },
        { text: "Solo en Oceanía", correct: false },
      ],
    },
    {
      question: "¿Qué tema principal tienen la mayoría de villancicos tradicionales?",
      options: [
        { text: "El nacimiento de Jesús", correct: true },
        { text: "Las vacaciones en la playa", correct: false },
        { text: "Las compras de rebajas", correct: false },
        { text: "El deporte de invierno", correct: false },
      ],
    },
    {
      question:
        "¿Qué se suele hacer mientras se cantan villancicos en familia o con amigos?",
      options: [
        { text: "Reunirse alrededor del árbol o el Belén", correct: true },
        { text: "Ir al cine", correct: false },
        { text: "Jugar a videojuegos", correct: false },
        { text: "Pintar murales", correct: false },
      ],
    },
    {
      question:
        "¿Qué palabra aparece con frecuencia en muchos villancicos para expresar alegría?",
      options: [
        { text: "Aleluya", correct: true },
        { text: "Adiós", correct: false },
        { text: "Silencio", correct: false },
        { text: "Suspenso", correct: false },
      ],
    },
    {
      question: "¿En qué época del año se suelen cantar los villancicos?",
      options: [
        { text: "En Navidad", correct: true },
        { text: "En verano", correct: false },
        { text: "En primavera", correct: false },
        { text: "En otoño", correct: false },
      ],
    },
    {
      question: "¿Qué formato es típico para los villancicos en colegios y coros?",
      options: [
        { text: "Coro de voces infantiles o mixtas", correct: true },
        { text: "Solo dúos de ópera", correct: false },
        { text: "Solo rap improvisado", correct: false },
        { text: "Solo música electrónica", correct: false },
      ],
    },
  ],
  cine: [
    {
      question: "¿En qué película navideña aparece el niño Kevin McCallister?",
      options: [
        { text: "Solo en casa", correct: true },
        { text: "Arthur Christmas", correct: false },
        { text: "Elf", correct: false },
        { text: "El Grinch", correct: false },
      ],
    },
    {
      question: "¿Qué criatura verde odia la Navidad al principio de su famosa película?",
      options: [
        { text: "El Grinch", correct: true },
        { text: "Un ogro", correct: false },
        { text: "Un duende", correct: false },
        { text: "Un reno", correct: false },
      ],
    },
    {
      question: "¿En qué ciudad transcurre gran parte de la acción de “Solo en casa 2”?",
      options: [
        { text: "Nueva York", correct: true },
        { text: "Londres", correct: false },
        { text: "París", correct: false },
        { text: "Roma", correct: false },
      ],
    },
    {
      question:
        "¿Qué película romántica coral tiene lugar en Navidad y transcurre en Londres?",
      options: [
        { text: "Love Actually", correct: true },
        { text: "The Holiday", correct: false },
        { text: "Klaus", correct: false },
        { text: "Polar Express", correct: false },
      ],
    },
    {
      question:
        "¿Qué vehículo mágico lleva a los niños al Polo Norte en una película animada?",
      options: [
        { text: "Un tren llamado Polar Express", correct: true },
        { text: "Un submarino amarillo", correct: false },
        { text: "Un avión de papel", correct: false },
        { text: "Una nave espacial", correct: false },
      ],
    },
    {
      question: "¿Qué personaje mítico protagoniza la película “Klaus”?",
      options: [
        {
          text: "Un repartidor de cartas y un fabricante de juguetes",
          correct: true,
        },
        { text: "Un detective navideño", correct: false },
        { text: "Un rey mago solitario", correct: false },
        { text: "Un reno parlante", correct: false },
      ],
    },
    {
      question: "¿Qué emoción intenta recuperar el personaje de 'Elf' en la ciudad?",
      options: [
        { text: "El espíritu navideño", correct: true },
        { text: "El miedo", correct: false },
        { text: "La ira", correct: false },
        { text: "La envidia", correct: false },
      ],
    },
    {
      question:
        "¿Qué suele ocurrir al final de muchas películas navideñas clásicas?",
      options: [
        { text: "Un final feliz y emotivo", correct: true },
        { text: "Un gran terremoto", correct: false },
        { text: "Una invasión alienígena", correct: false },
        { text: "Un concurso de cocina", correct: false },
      ],
    },
    {
      question:
        "¿En qué época del año se estrenan tradicionalmente muchas películas navideñas?",
      options: [
        { text: "En los meses previos a Navidad", correct: true },
        { text: "En plena primavera", correct: false },
        { text: "Solo en verano", correct: false },
        { text: "En septiembre exclusivamente", correct: false },
      ],
    },
    {
      question:
        "¿Qué elemento aparece casi siempre en el fondo de las escenas navideñas de cine?",
      options: [
        { text: "Luces, nieve y decoraciones", correct: true },
        { text: "Playas tropicales", correct: false },
        { text: "Estadios de fútbol", correct: false },
        { text: "Desiertos de arena", correct: false },
      ],
    },
  ],
  curiosidades: [
    {
      question: "¿En qué estación del año cae la Navidad en el hemisferio norte?",
      options: [
        { text: "Invierno", correct: true },
        { text: "Verano", correct: false },
        { text: "Otoño", correct: false },
        { text: "Primavera", correct: false },
      ],
    },
    {
      question:
        "¿En qué país la Navidad se celebra en pleno verano debido a que está en el hemisferio sur?",
      options: [
        { text: "Australia", correct: true },
        { text: "Noruega", correct: false },
        { text: "Canadá", correct: false },
        { text: "Rusia", correct: false },
      ],
    },
    {
      question:
        "¿Qué fenómeno meteorológico se asocia visualmente con muchas postales navideñas?",
      options: [
        { text: "La nieve", correct: true },
        { text: "La lluvia tropical", correct: false },
        { text: "La niebla veraniega", correct: false },
        { text: "Las tormentas de arena", correct: false },
      ],
    },
    {
      question: "¿Cómo se llama el periodo de compras intenso que precede a la Navidad?",
      options: [
        { text: "Campaña navideña", correct: true },
        { text: "Semana blanca", correct: false },
        { text: "Vacaciones de primavera", correct: false },
        { text: "Fiesta de otoño", correct: false },
      ],
    },
    {
      question: "¿Qué animal tira tradicionalmente del trineo de Papá Noel?",
      options: [
        { text: "Renos", correct: true },
        { text: "Caballos", correct: false },
        { text: "Camellos", correct: false },
        { text: "Lobos árticos", correct: false },
      ],
    },
    {
      question: "¿Qué color NO se asocia normalmente con la Navidad?",
      options: [
        { text: "Morado neón", correct: true },
        { text: "Rojo", correct: false },
        { text: "Verde", correct: false },
        { text: "Dorado", correct: false },
      ],
    },
    {
      question:
        "¿Qué día se celebra el Día de los Santos Inocentes en muchos países hispanohablantes?",
      options: [
        { text: "28 de diciembre", correct: true },
        { text: "1 de diciembre", correct: false },
        { text: "31 de diciembre", correct: false },
        { text: "2 de enero", correct: false },
      ],
    },
    {
      question:
        "¿Qué tipo de luz se usa mucho para decorar fachadas y árboles en Navidad?",
      options: [
        { text: "Luces LED de colores", correct: true },
        { text: "Linternas de camping", correct: false },
        { text: "Focos de estadio", correct: false },
        { text: "Lámparas de escritorio", correct: false },
      ],
    },
    {
      question:
        "¿Qué elemento invernal se representa a menudo con bufanda y sombrero?",
      options: [
        { text: "Un muñeco de nieve", correct: true },
        { text: "Un pingüino gigante", correct: false },
        { text: "Un árbol de hoja caduca", correct: false },
        { text: "Un castillo de arena", correct: false },
      ],
    },
    {
      question:
        "¿Qué ocurre con la duración del día alrededor de la Navidad en el hemisferio norte?",
      options: [
        { text: "Los días son cortos y las noches largas", correct: true },
        { text: "Los días son muy largos", correct: false },
        { text: "No hay cambios en la luz", correct: false },
        { text: "Siempre es de día", correct: false },
      ],
    },
  ],
};

function Snowfall() {
  useEffect(() => {
    const interval = setInterval(() => {
      const snowflake = document.createElement("div");
      snowflake.textContent = "❄";
      snowflake.style.position = "fixed";
      snowflake.style.top = "-2vh";
      snowflake.style.left = Math.random() * 100 + "vw";
      snowflake.style.fontSize = `${Math.random() * 16 + 8}px`;
      snowflake.style.color = COLORS.white;
      snowflake.style.opacity = Math.random().toString();
      snowflake.style.userSelect = "none";
      snowflake.style.pointerEvents = "none";
      snowflake.style.zIndex = "1000";
      snowflake.style.transition = "top 5s linear";
      document.body.appendChild(snowflake);
      setTimeout(() => {
        snowflake.style.top = "100vh";
      }, 50);
      setTimeout(() => {
        snowflake.remove();
      }, 5500);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return null;
}

export default function App() {
  const [screen, setScreen] = useState<"start" | "category" | "question" | "result" | "ranking">(
    "start"
  );
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [showCongrats, setShowCongrats] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);
  const [lastCategory, setLastCategory] = useState<CategoryKey | null>(null);

  useEffect(() => {
    if (screen !== "question") return;
    if (timeLeft === 0) {
      handleAnswer(null);
      return;
    }
    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, screen]);

  const startGame = () => {
    if (!musicStarted) {
      bgMusic.play().catch(() => {});
      setMusicStarted(true);
    }
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});

    setScreen("category");
    setQuestions([]);
    setQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setShowCongrats(false);
    setTimeLeft(15);
  };

  const selectCategory = (key: CategoryKey) => {

    const allQuestions = questionsDB[key];
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);

    // pequeño truco para no repetir el mismo bloque dos veces seguidas
    let startIndex = 0;
    if (lastCategory === key && allQuestions.length > 5) {
      startIndex = 5;
    }

    const selected = shuffled.slice(startIndex, startIndex + 5);

    setQuestions(selected);
    setScreen("question");
    setQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setTimeLeft(15);
    setLastCategory(key);
  };

  const handleAnswer = (optionIndex: number | null) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIndex);

    const currentQ = questions[questionIndex];
    const isCorrect =
      optionIndex !== null ? currentQ.options[optionIndex].correct : false;

    if (isCorrect) {
      correctSound.currentTime = 0;
      correctSound.play().catch(() => {});
      setScore((prev) => prev + 1);
    } else {
      wrongSound.currentTime = 0;
      wrongSound.play().catch(() => {});
    }

    setTimeout(() => {
      const finalScore = score + (isCorrect ? 1 : 0);

      if (questionIndex + 1 < questions.length) {
        setQuestionIndex((prev) => prev + 1);
        setSelectedOption(null);
        setTimeLeft(15);
      } else {
        if (finalScore > 3) {
          setShowCongrats(true);
        }
        setScreen("result");
      }
    }, 1500);
  };

  const CongratsMessage = () => (
    <div
      style={{
        color: COLORS.gold,
        fontSize: "1.5rem",
        fontWeight: "bold",
        marginBottom: "1rem",
        textAlign: "center",
      }}
    >
      ¡Felicidades, Maestro de la Navidad!
    </div>
  );

  return (
    <div
      style={{
        fontFamily: `"Inter", sans-serif`,
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${COLORS.red}, ${COLORS.green})`,
        color: COLORS.green,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        boxSizing: "border-box",
        position: "relative",
        overflowX: "hidden",
        width: "100vw",
      }}
    >
      <Snowfall />

      <div
        style={{
          width: "100%",
          maxWidth: 900,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}
      >
        {screen === "start" && (
          <div style={{ textAlign: "center", color: COLORS.gold, width: "100%" }}>
            <h1
              style={{
                fontFamily: `"Playfair Display", serif`,
                fontSize: "clamp(2.2rem, 6vw, 3rem)",
                marginBottom: "1rem",
              }}
            >
              Trivial Xmas
              <span
                style={{
                  display: "inline-block",
                  marginLeft: 10,
                  animation: "pulse 2s infinite",
                  color: COLORS.white,
                }}
              >
                ✨
              </span>
            </h1>
            <button
              onClick={startGame}
              style={{
                fontSize: "clamp(1.1rem, 3.5vw, 1.5rem)",
                padding: "0.8rem 2.5rem",
                backgroundColor: COLORS.gold,
                border: `2px solid ${COLORS.white}`,
                borderRadius: 12,
                color: COLORS.green,
                cursor: "pointer",
                fontWeight: "bold",
                boxShadow: `0 0 8px ${COLORS.gold}`,
                marginBottom: 20,
                width: "100%",
                maxWidth: 280,
              }}
            >
              Jugar
            </button>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 12,
              }}
            >
              <button
                onClick={() => {
                  clickSound.currentTime = 0;
                  clickSound.play().catch(() => {});
                  setScreen("ranking");
                }}
                style={{
                  backgroundColor: COLORS.white,
                  border: `2px solid ${COLORS.gold}`,
                  borderRadius: 8,
                  padding: "0.5rem 1.2rem",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                Clasificación
              </button>
              <button
                onClick={() => {
                  clickSound.currentTime = 0;
                  clickSound.play().catch(() => {});
                  alert("Ajustes próximamente");
                }}
                style={{
                  backgroundColor: COLORS.white,
                  border: `2px solid ${COLORS.gold}`,
                  borderRadius: 8,
                  padding: "0.5rem 1.2rem",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                Ajustes
              </button>
              <button
                onClick={() => {
                  clickSound.currentTime = 0;
                  clickSound.play().catch(() => {});
                  alert("Juego navideño interactivo, disfruta!");
                }}
                style={{
                  backgroundColor: COLORS.white,
                  border: `2px solid ${COLORS.gold}`,
                  borderRadius: 8,
                  padding: "0.5rem 1.2rem",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                Sobre el juego
              </button>
            </div>
          </div>
        )}

        {screen === "category" && (
          <div
            style={{
              width: "100%",
              textAlign: "center",
              color: COLORS.green,
            }}
          >
            <h2
              style={{
                fontFamily: `"Playfair Display", serif`,
                marginBottom: 20,
                fontSize: "clamp(1.5rem, 4vw, 2rem)",
              }}
            >
              Elige tu categoría
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
                gap: 12,
              }}
            >
              {categories.map((cat) => (
                <div
                  key={cat.key}
                  onClick={() => {
                    clickSound.currentTime = 0;
                    clickSound.play().catch(() => {});
                    selectCategory(cat.key);
                  }}
                  style={{
                    cursor: "pointer",
                    backgroundColor: COLORS.white,
                    borderRadius: 12,
                    padding: 12,
                    boxShadow: "0 0 10px rgba(212,175,55,0.6)",
                    color: COLORS.gold,
                    fontWeight: "bold",
                    userSelect: "none",
                    transition: "transform 0.2s",
                    fontSize: "0.9rem",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.03)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  {cat.label}
                </div>
              ))}
            </div>
          </div>
        )}

        {screen === "question" && questions.length > 0 && (
          <div
            style={{
              width: "100%",
              backgroundColor: COLORS.white,
              borderRadius: 16,
              padding: 16,
              boxShadow: "0 0 15px rgba(212,175,55,0.8)",
              color: COLORS.green,
              position: "relative",
            }}
          >
            <div
              style={{
                height: 40,
                backgroundColor: COLORS.green,
                color: COLORS.white,
                borderRadius: "12px 12px 0 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 12px",
                fontWeight: "bold",
                fontFamily: `"Playfair Display", serif`,
                fontSize: "0.95rem",
              }}
            >
              Pregunta {questionIndex + 1}/{questions.length}
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    border: `3px solid ${COLORS.gold}`,
                    position: "relative",
                    marginRight: 8,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: COLORS.gold,
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    backgroundColor: COLORS.white,
                  }}
                >
                  ❄
                  <svg
                    style={{
                      position: "absolute",
                      top: -8,
                      left: -8,
                      width: 40,
                      height: 40,
                      transformOrigin: "center",
                      animation: "spin 10s linear infinite",
                      stroke: COLORS.gold,
                      strokeWidth: 2,
                      fill: "none",
                    }}
                    viewBox="0 0 24 24"
                  >
                    ircle cx="12" cy="12" r="10" /
                  </svg>
                </div>
                <span style={{ fontSize: "1rem" }}>{timeLeft}s</span>
              </div>
            </div>
            <h3
              style={{
                fontFamily: `"Playfair Display", serif`,
                fontSize: "clamp(1.2rem, 4vw, 1.8rem)",
                margin: "16px 0",
                textAlign: "center",
              }}
            >
              {questions[questionIndex].question}
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
                gap: 10,
              }}
            >
              {questions[questionIndex].options.map(
                (opt: Option, i: number) => {
                  let bgColor = COLORS.white;
                  let borderColor = COLORS.gold;
                  let textColor = COLORS.green;

                  if (selectedOption === i) {
                    if (opt.correct) {
                      bgColor = COLORS.green;
                      borderColor = COLORS.gold;
                      textColor = COLORS.white;
                    } else {
                      bgColor = COLORS.red;
                      borderColor = COLORS.red;
                      textColor = COLORS.white;
                    }
                  }

                  return (
                    <div
                      key={i}
                      onClick={() =>
                        selectedOption === null ? handleAnswer(i) : null
                      }
                      style={{
                        cursor: selectedOption === null ? "pointer" : "default",
                        backgroundColor: bgColor,
                        border: `3px solid ${borderColor}`,
                        padding: 12,
                        borderRadius: 12,
                        color: textColor,
                        fontWeight: "bold",
                        userSelect: "none",
                        textAlign: "center",
                        boxShadow:
                          selectedOption === i && opt.correct
                            ? `0 0 15px ${COLORS.gold}`
                            : "none",
                        transition: "all 0.3s ease",
                        fontSize: "0.9rem",
                      }}
                    >
                      {opt.text}
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}

        {screen === "result" && (
          <div
            style={{
              textAlign: "center",
              color: COLORS.gold,
              background: `linear-gradient(135deg, ${COLORS.green}, ${COLORS.gold})`,
              padding: 24,
              borderRadius: 20,
              boxShadow: `0 0 20px ${COLORS.gold}`,
              width: "100%",
              maxWidth: 500,
            }}
          >
            {showCongrats && <CongratsMessage />}
            <h2
              style={{
                fontFamily: `"Playfair Display", serif`,
                marginBottom: 16,
                fontSize: "clamp(1.4rem, 4vw, 1.8rem)",
              }}
            >
              Has acertado: {score}/{questions.length} preguntas
            </h2>
            <div
              style={{
                marginTop: 16,
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 12,
              }}
            >
              <button
                onClick={() => {
                  clickSound.currentTime = 0;
                  clickSound.play().catch(() => {});
                  setScreen("start");
                }}
                style={{
                  backgroundColor: COLORS.white,
                  borderRadius: 12,
                  padding: "0.6rem 1.4rem",
                  border: `2px solid ${COLORS.gold}`,
                  cursor: "pointer",
                  fontWeight: "bold",
                  color: COLORS.green,
                  fontSize: "0.9rem",
                }}
              >
                Volver al inicio
              </button>
              <button
                onClick={() => {
                  clickSound.currentTime = 0;
                  clickSound.play().catch(() => {});
                  startGame();
                }}
                style={{
                  backgroundColor: COLORS.white,
                  borderRadius: 12,
                  padding: "0.6rem 1.4rem",
                  border: `2px solid ${COLORS.gold}`,
                  cursor: "pointer",
                  fontWeight: "bold",
                  color: COLORS.green,
                  fontSize: "0.9rem",
                }}
              >
                Jugar otra vez
              </button>
              <button
                onClick={() => {
                  clickSound.currentTime = 0;
                  clickSound.play().catch(() => {});
                  alert(`Compartir puntuación: ${score}/${questions.length} 🎁`);
                }}
                style={{
                  backgroundColor: COLORS.white,
                  borderRadius: 12,
                  padding: "0.6rem 1.4rem",
                  border: `2px solid ${COLORS.gold}`,
                  cursor: "pointer",
                  fontWeight: "bold",
                  color: COLORS.green,
                  fontSize: "0.9rem",
                }}
              >
                Compartir puntuación 🎁
              </button>
            </div>
          </div>
        )}

        {screen === "ranking" && (
          <div
            style={{
              width: "100%",
              maxWidth: 600,
              textAlign: "center",
              backgroundColor: COLORS.white,
              borderRadius: 16,
              padding: 20,
              boxShadow: "0 0 12px rgba(212,175,55,0.7)",
              color: COLORS.green,
            }}
          >
            <h2
              style={{
                fontFamily: `"Playfair Display", serif`,
                marginBottom: 24,
                fontSize: "clamp(1.4rem, 4vw, 1.8rem)",
              }}
            >
              Clasificación
            </h2>
            <div style={{ marginBottom: 12 }}>
              <div
                style={{
                  border: `3px solid ${COLORS.gold}`,
                  borderRadius: 12,
                  padding: 10,
                  marginBottom: 8,
                  backgroundColor: "#fff9e6",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                }}
              >
                🥇 Juan - 9 puntos
              </div>
              <div
                style={{
                  border: `3px solid silver`,
                  borderRadius: 12,
                  padding: 10,
                  marginBottom: 8,
                  backgroundColor: "#f7f7f7",
                  fontWeight: "bold",
                  fontSize: "1rem",
                }}
              >
                🥈 María - 7 puntos
              </div>
              <div
                style={{
                  border: `3px solid ${COLORS.green}`,
                  borderRadius: 12,
                  padding: 10,
                  fontWeight: "bold",
                  fontSize: "1rem",
                  backgroundColor: "#ecf8f3",
                }}
              >
                🥉 Luis - 6 puntos
              </div>
            </div>
            <button
              onClick={() => {
                clickSound.currentTime = 0;
                clickSound.play().catch(() => {});
                setScreen("start");
              }}
              style={{
                backgroundColor: COLORS.gold,
                borderRadius: 12,
                padding: "0.8rem 2rem",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
                color: COLORS.white,
                fontSize: "0.95rem",
              }}
            >
              Volver al inicio
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
