import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabaseClient";



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

const categories: { key: CategoryKey; label: string }[] = [
  { key: "tradiciones", label: "🎁 Tradiciones" },
  { key: "comida", label: "🍪 Comida y Dulces" },
  { key: "villancicos", label: "🎶 Villancicos y Música" },
  { key: "cine", label: "🎬 Cine Navideño" },
  { key: "curiosidades", label: "❄ Curiosidades Navideñas" },
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
        { text: "Una campana", correct: false },
        { text: "Un calcetín", correct: false },
        { text: "Una estrella", correct: true },
        { text: "Un bastón de caramelo", correct: false },
      ],
    },
    {
      question: "¿Qué celebra la Navidad en la tradición cristiana?",
      options: [
        { text: "La llegada de los Reyes Magos", correct: false },
        { text: "El inicio del año nuevo", correct: false },
        { text: "El fin del invierno", correct: false },
        { text: "El nacimiento de Jesús", correct: true },
      ],
    },
    {
      question: "¿Qué país es famoso por celebrar San Nicolás el 6 de diciembre?",
      options: [

        { text: "Brasil", correct: false },
        { text: "Argentina", correct: false },
        { text: "Países Bajos", correct: true },
        { text: "Japón", correct: false },
      ],
    },
    {
      question:
        "¿Cuál es el nombre tradicional del personaje que reparte regalos en España y Latinoamérica?",
      options: [
        { text: "Papá Noel", correct: false },
        { text: "Los Reyes Magos", correct: true },
        { text: "Santa Claus", correct: false },
        { text: "Elfos de invierno", correct: false },
      ],
    },
    {
      question: "¿Qué objeto se cuelga en las puertas como adorno navideño tradicional?",
      options: [

        { text: "Un muñeco de nieve", correct: false },
        { text: "Una corona de ramas verdes", correct: true },
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

        { text: "La Nochebuena", correct: false },
        { text: "La Nochevieja", correct: false },
        { text: "El Día de Reyes", correct: true },
        { text: "El Día de los Inocentes", correct: false },
      ],
    },
    {
      question:
        "¿Qué significado tiene tradicionalmente la estrella colocada en el árbol o el Belén?",
      options: [
        { text: "Un copo de nieve", correct: false },
        { text: "El sol de invierno", correct: false },
        { text: "Un cometa decorativo", correct: false },
        { text: "La estrella de Belén", correct: true },
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
        { text: "Mantecados", correct: false },
        { text: "Roscón de Reyes", correct: false },
        { text: "Panettone", correct: false },
        { text: "Turrón", correct: true },
      ],
    },
    {
      question: "En Hello Valencia nos encanta los panettones de Polo ¿de donde son originarios?",
      options: [
        { text: "Suecia", correct: false },
        { text: "Italia", correct: true },
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
      question: "¿Qué bebida espumosa se usa para el brindis de Año Nuevo?",
      options: [
        { text: "Cerveza rubia", correct: false },
        { text: "Sidra o cava", correct: true },
        { text: "Té verde", correct: false },
        { text: "Vermú", correct: false },
      ],
    },
    {
      question: "¿Qué ingrediente destaca en las galletas típicas de Navidad?",
      options: [
        { text: "Vainilla", correct: false },
        { text: "Chocolate", correct: false },
        { text: "Jengibre", correct: true },
        { text: "Coco", correct: false },
      ],

    },
    {
      question: "¿Qué fruto seco es protagonista en muchos dulces navideños?",
      options: [
        { text: "Cacahuete salado", correct: false },
        { text: "Girasol", correct: false },
        { text: "Pistacho solo", correct: false },
        { text: "Almendra", correct: true },
      ],
    },
    {
      question: "¿Qué postre redondo y relleno se suele comer el 6 de enero en España?",
      options: [
        { text: "Tarta de queso", correct: false },
        { text: "Roscón de Reyes", correct: true },
        { text: "Flan de huevo", correct: false },
        { text: "Brownie", correct: false },
      ],
    },
    {
      question: "¿Qué figura se esconde dentro del Roscón de Reyes?",
      options: [
        { text: "Un reno", correct: false },
        { text: "Un muñeco o haba", correct: true },
        { text: "Una estrella", correct: false },
        { text: "Un ángel", correct: false },
      ],
    },
    {
      question: "¿Cuál de estos dulces se suele asociar a la Navidad en Alemania?",
      options: [
        { text: "Macaron", correct: false },
        { text: "Stollen", correct: true },
        { text: "Pastel de luna", correct: false },
        { text: "Churros", correct: false },
      ],
    },
    {
      question: "¿Qué se le deja a los camellos de los Reyes Magos mientras que dejan los regalos?",
      options: [
        { text: "Pizza", correct: false },
        { text: "Palomitas", correct: false },
        { text: "Helado", correct: false },
        { text: "Zanahorias", correct: true },
      ],
    },
    {
      question: "¿Qué dulce español está hecho de yema de huevo caramelizada?",
      options: [
        { text: "Polvorones", correct: false },
        { text: "Yemas de Santa Teresa", correct: true },
        { text: "Mazapán", correct: false },
        { text: "Rosquillas", correct: false },
      ],
    },
    {
      question: "Marqués de Riscal es el protagonista de la portada Soul de diciembre ¿de donde es típico el vino caliente?",
      options: [
        { text: "La fiesta del aniverario de Hello", correct: false },
        { text: "Despues de comernos las uvas", correct: false },
        { text: "En el tardeo de nochebuena", correct: false },
        { text: "Los mercados navideños europeos", correct: true },
      ],
    },
  ],
  villancicos: [
    {
      question: "Las Lucias de Hello son muy fan de los villancicos Bisbal ¿cuál de estos artistas es el más escuchado en este época?",
      options: [
        { text: "Leticia Sabater", correct: false },
        { text: "Mariah Carey", correct: true },
        { text: "Bad Bunny", correct: false },
        { text: "Melendi", correct: false },
      ],
    },
    {
      question: "¿Cuál de estos instrumentos es típico en muchas canciones navideñas españolas?",
      options: [
        { text: "Gaita", correct: false },
        { text: "Zambomba", correct: true },
        { text: "Trompeta", correct: false },
        { text: "Flauta travesera", correct: false },
      ],
    },
    {
      question: "¿Qué canción navideña se convirtió en un éxito de Wham!?",
      options: [
        { text: "Let It Snow", correct: false },
        { text: "White Christmas", correct: false },
        { text: "Last Christmas", correct: true },
        { text: "Holly Jolly Christmas", correct: false },
      ],
    },
    {
      question: "¿Qué instrumento destaca en el villancico “El tamborilero”?",
      options: [
        { text: "El violín", correct: false },
        { text: "El tambor", correct: true },
        { text: "La trompeta", correct: false },
        { text: "La flauta", correct: false },
      ],
    },
    {
      question: "¿Qué canción navideña mezcla inglés y español y es conocida mundialmente?",
      options: [
        { text: "Navidad, Navidad", correct: false },
        { text: "Feliz Navidad", correct: true },
        { text: "Noche de Paz", correct: false },
        { text: "Let It Snow", correct: false },
      ],
    },
    {
      question: "¿En qué canción aparece una historia de un reno con la nariz roja?",
      options: [
        { text: "Rudolph the Red-Nosed Reindeer", correct: true },
        { text: "Frosty the Snowman", correct: false },
        { text: "Let It Snow", correct: false },
        { text: "Santa Baby", correct: false },
      ],
    },
    {
      question:
        "¿Qué se suele hacer mientras se cantan villancicos en familia o con amigos?",
      options: [
        { text: "Ir al cine", correct: false },
        { text: "Jugar a videojuegos", correct: false },
        { text: "Pintar murales", correct: false },
        { text: "Reunirse alrededor del árbol o el Belén", correct: true },
      ],
    },
    {
      question: "¿Qué artista lanzó un álbum navideño en el que mezcla jazz con canciones tradicionales?",
      options: [
        { text: "Michael Bublé", correct: true },
        { text: "Ariana Grande", correct: false },
        { text: "Bruno Mars", correct: false },
        { text: "Billie Eilish", correct: false },
      ],
    },
    {
      question: "¿Cuál de estas canciones en español es un villancico clásico?",
      options: [
        { text: "Los peces en el río", correct: true },
        { text: "La Macarena", correct: false },
        { text: "Torero", correct: false },
        { text: "Súbeme la radio", correct: false },
      ],
    },
  ],
  cine: [
    {
      question: "¿En qué película navideña aparece el niño Kevin McCallister?",
      options: [
        { text: "Arthur Christmas", correct: false },
        { text: "Elf", correct: false },
        { text: "Solo en casa", correct: true },
        { text: "El Grinch", correct: false },
      ],
    },
    {
      question: "¿Qué criatura verde odia la Navidad al principio de su famosa película?",
      options: [
        { text: "Un ogro", correct: false },
        { text: "El Grinch", correct: true },
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
        { text: "The Holiday", correct: false },
        { text: "Klaus", correct: false },
        { text: "Polar Express", correct: false },
        { text: "Love Actually", correct: true },
      ],
    },
    {
      question: "¿Qué película navideña tiene un fantasma del pasado, del presente y del futuro?",
      options: [
        { text: "Un cuento de Navidad", correct: true },
        { text: "Elf", correct: false },
        { text: "Solo en casa", correct: false },
        { text: "Klaus", correct: false },
      ],
    },
    {
      question: "¿Qué personaje mítico protagoniza la película “Klaus”?",
      options: [
        { text: "Un detective navideño", correct: false },
        { text: "Un rey mago solitario", correct: false },
        { text: "Un reno parlante", correct: false },
        {
          text: "Un repartidor de cartas y un fabricante de juguetes",
          correct: true,
        },
      ],
    },
    {
      question: "¿Qué emoción intenta recuperar el personaje de 'Elf' en la ciudad?",
      options: [
        { text: "El miedo", correct: false },
        { text: "La ira", correct: false },
        { text: "El espíritu navideño", correct: true },
        { text: "La envidia", correct: false },
      ],
    },
    {
      question: "¿Qué animal mágico acompaña a Santa en muchas películas?",
      options: [
        { text: "Caballos alados", correct: false },
        { text: "Pingüinos parlantes", correct: false },
        { text: "Renos", correct: true },
        { text: "Zorros árticos", correct: false },
      ],
    },
    {
      question:
        "¿En qué época del año se estrenan tradicionalmente muchas películas navideñas?",
      options: [
        { text: "En plena primavera", correct: false },
        { text: "Solo en verano", correct: false },
        { text: "En los meses previos a Navidad", correct: true },
        { text: "En septiembre exclusivamente", correct: false },
      ],
    },
    {
      question:
        "¿Qué elemento aparece casi siempre en el fondo de las escenas navideñas de cine?",
      options: [
        { text: "Playas tropicales", correct: false },
        { text: "Estadios de fútbol", correct: false },
        { text: "Desiertos de arena", correct: false },
        { text: "Luces, nieve y decoraciones", correct: true },
      ],
    },
  ],
  curiosidades: [
    {
      question: "¿Quién NO suele aparecer en un belén tradicional de Navidad?",
      options: [
        { text: "La perrita Puka de Silvia", correct: true },
        { text: "Un pastor con ovejas", correct: false },
        { text: "Un ángel anunciando la llegada", correct: false },
        { text: "Un buey y una mula", correct: false },
      ],
    },
    {
      question: "¿Qué se celebra el 22 de diciembre en España?",
      options: [
        { text: "La llegada de Papá Noel", correct: false },
        { text: "La cabalgata de Reyes", correct: false },
        { text: "El sorteo de la Lotería de Navidad", correct: true },
        { text: "El encendido de las luces", correct: false },
      ],
    },
    {
      question:
        "¿Dónde nació Jesús según la tradición cristiana?",
      options: [
        { text: "En Nazaret", correct: false },
        { text: "En Belén", correct: true },
        { text: "En Oliva, como Manolo", correct: false },
        { text: "En Roma", correct: false },
      ],
    },
    {
      question:
        "¿Qué fenómeno meteorológico se asocia visualmente con muchas postales navideñas?",
      options: [
        { text: "La lluvia tropical", correct: false },
        { text: "La nieve", correct: true },
        { text: "La niebla veraniega", correct: false },
        { text: "Las tormentas de arena", correct: false },
      ],
    },
    {
      question: "¿Cómo se llama el periodo de compras intenso que precede a la Navidad?",
      options: [
        { text: "Semana blanca", correct: false },
        { text: "Vacaciones de primavera", correct: false },
        { text: "Campaña navideña", correct: true },
        { text: "Fiesta de otoño", correct: false },
      ],
    },
    {
      question: "¿Qué animal tira tradicionalmente del trineo de Papá Noel?",
      options: [
        { text: "Caballos", correct: false },
        { text: "Camellos", correct: false },
        { text: "Lobos árticos", correct: false },
        { text: "Renos", correct: true },
      ],
    },
    {
      question: "¿Qué color NO se asocia normalmente con la Navidad?",
      options: [
        { text: "Rojo", correct: false },
        { text: "Verde", correct: false },
        { text: "Morado neón", correct: true },
        { text: "Dorado", correct: false },
      ],
    },
    {
      question:
        "¿Qué día se celebra el Día de los Santos Inocentes en muchos países hispanohablantes?",
      options: [
        { text: "1 de diciembre", correct: false },
        { text: "28 de diciembre", correct: true },
        { text: "31 de diciembre", correct: false },
        { text: "2 de enero", correct: false },
      ],
    },
    {
      question: "¿Qué figura navideña tiene nariz de zanahoria?",
      options: [
        { text: "El reno Rodolfo", correct: false },
        { text: "Un muñeco de nieve", correct: true },
        { text: "Un duende", correct: false },
        { text: "Papá Noel", correct: false },
      ],
    },
    {
      question:
        "¿Qué elemento invernal se representa a menudo con bufanda y sombrero?",
      options: [
        { text: "Un pingüino gigante", correct: false },
        { text: "Un árbol de hoja caduca", correct: false },
        { text: "Un castillo de arena", correct: false },
        { text: "Un muñeco de nieve", correct: true },
      ],
    },
    {
      question:
        "¿Qué ocurre con la duración del día alrededor de la Navidad en el hemisferio norte?",
      options: [
        { text: "Los días son muy largos", correct: false },
        { text: "No hay cambios en la luz", correct: false },
        { text: "Los días son cortos y las noches largas", correct: true },
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
  const [screen, setScreen] = useState<"start" | "name" | "category" | "question" | "result" | "ranking">(
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
  const [playerName, setPlayerName] = useState("");
  const [confirmedName, setConfirmedName] = useState("");
  const [ranking, setRanking] = useState<any[]>([]);
  const [rankingCategory, setRankingCategory] = useState<CategoryKey>("tradiciones");



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

  // Sonidos globales (se sirven desde /public)
  const clickRef = useRef<HTMLAudioElement | null>(null);
  const correctRef = useRef<HTMLAudioElement | null>(null);
  const wrongRef = useRef<HTMLAudioElement | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);

  const startGame = () => {
    // música de fondo
    if (!musicStarted) {
      if (!musicRef.current) {
        musicRef.current = new Audio("/sounds/bg-music.mp3");
        musicRef.current.loop = true;
        musicRef.current.volume = 0.4;
      }
      musicRef.current
        .play()
        .then(() => setMusicStarted(true))
        .catch(() => { });
    }

    // sonido de click
    if (!clickRef.current) {
      clickRef.current = new Audio("/sounds/click.mp3");
    }
    clickRef.current.currentTime = 0;
    clickRef.current.play().catch(() => { });

    // ahora solo cambiamos a la pantalla de nombre
    setScreen("name");
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
      if (!correctRef.current) {
        correctRef.current = new Audio("/sounds/correct.mp3");
      }
      correctRef.current.currentTime = 0;
      correctRef.current.play().catch(() => { });
      setScore((prev) => prev + 1);
    } else {
      if (!wrongRef.current) {
        wrongRef.current = new Audio("/sounds/wrong.wav");
      }
      wrongRef.current.currentTime = 0;
      wrongRef.current.play().catch(() => { });
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
        setPlayerName("");
        setScreen("result");
      }
    }, 1500);
  };

  const guardarPartida = async () => {
    if (!confirmedName.trim() || !lastCategory) return;

    try {
      //setIsSaving(true);
      const { error } = await supabase.from("partidas").insert({
        nombre: confirmedName.trim(),
        puntuacion: score,
        categoria: lastCategory,   // antes: "todas"
      });
      if (!error && lastCategory) {
        await cargarRanking(lastCategory);
      }

    } finally {
      //setIsSaving(false);
    }
  };

  const cargarRanking = async (cat: CategoryKey | "todas") => {
    let query = supabase.from("partidas").select("*");
    if (cat !== "todas") {
      query = query.eq("categoria", cat);
    }
    const { data, error } = await query
      .order("puntuacion", { ascending: false })
      .limit(10);
    if (!error && data) setRanking(data);
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

      {/* Logo fijo arriba en todas las pantallas */}
      <img
        src="/images/logo.jpg"
        alt="Logo de la empresa"
        style={{
          width: 120,
          height: 120,
          borderRadius: "50%",     // lo hace circular
          objectFit: "cover",      // recorta si no es cuadrado
          border: `3px solid ${COLORS.gold}`,
          marginBottom: 16,
        }}
      />

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
        {/* aquí van screen === "start", "name", etc. */}

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
                lineHeight: "1.2",
                WebkitAppearance: "none",
                MozAppearance: "none",
                appearance: "none",
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
              {/* Clasificación */}
              <button
                onClick={() => {
                  if (!clickRef.current) {
                    clickRef.current = new Audio("/sounds/click.mp3");
                  }
                  clickRef.current.currentTime = 0;
                  clickRef.current.play().catch(() => { });

                  const defaultCat: CategoryKey = "tradiciones";
                  setRankingCategory(defaultCat);
                  cargarRanking(defaultCat);
                  setScreen("ranking");
                }}
                style={{
                  backgroundColor: COLORS.white,
                  border: `2px solid ${COLORS.gold}`,
                  borderRadius: 8,
                  padding: "0.5rem 1.2rem",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  color: COLORS.green,
                  fontWeight: "bold",
                  lineHeight: "1.2",
                  WebkitAppearance: "none",
                  MozAppearance: "none",
                  appearance: "none",
                }}
              >
                Clasificación
              </button>
            </div>
          </div>
        )}


        {screen === "name" && (
          <div
            style={{
              textAlign: "center",
              color: COLORS.gold,
              width: "100%",
            }}
          >
            <h2
              style={{
                fontFamily: `"Playfair Display", serif`,
                fontSize: "clamp(1.6rem, 5vw, 2.2rem)",
                marginBottom: "1rem",
              }}
            >
              ¿Cómo te llamas?
            </h2>

            <p style={{ marginBottom: 12, color: COLORS.white }}>
              Escribe tu nombre para guardar tu puntuación en el ranking.
            </p>

            <input
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={40}
              style={{
                width: "100%",
                maxWidth: 320,
                padding: "0.6rem 0.9rem",
                borderRadius: 8,
                border: `1px solid ${COLORS.gold}`,
                boxSizing: "border-box",
                marginBottom: 16,
              }}
            />

            <div
              style={{
                marginTop: 8,
                display: "flex",
                justifyContent: "center",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => {
                  setPlayerName("");
                  setScreen("start");
                }}
                style={{
                  backgroundColor: COLORS.white,
                  borderRadius: 8,
                  padding: "0.4rem 1rem",
                  border: `2px solid ${COLORS.gold}`,
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  color: COLORS.green,
                  fontWeight: "bold",
                }}
              >
                Volver al inicio
              </button>

              <button
                onClick={() => {
                  const name = playerName.trim();
                  if (!name) return;
                  setConfirmedName(name);
                  setScreen("category");
                  setQuestions([]);
                  setQuestionIndex(0);
                  setScore(0);
                  setSelectedOption(null);
                  setShowCongrats(false);
                  setTimeLeft(15);
                }}
                style={{
                  backgroundColor: COLORS.gold,   // antes COLORS.white
                  borderRadius: 8,
                  padding: "0.4rem 1rem",
                  border: `2px solid ${COLORS.white}`,
                  cursor: playerName.trim() ? "pointer" : "not-allowed",
                  fontSize: "0.9rem",
                  color: COLORS.green,
                  fontWeight: "bold",
                }}
                disabled={!playerName.trim()}
              >
                Continuar
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
                    if (!clickRef.current) {
                      clickRef.current = new Audio("/sounds/click.mp3");
                    }
                    clickRef.current.currentTime = 0;
                    clickRef.current.play().catch(() => { });

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
              backgroundColor: COLORS.white,
              borderRadius: 16,
              padding: 24,
              maxWidth: 480,
              width: "100%",
              textAlign: "center",
            }}
          >
            {showCongrats ? (
              <>
                <CongratsMessage />
                <img
                  src="/images/felicitacion.jpg"
                  alt="Postal navideña ilustrada"
                  style={{
                    width: "100%",
                    maxWidth: 320,
                    borderRadius: 12,
                    margin: "0 auto 16px",
                    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                  }}
                />
              </>
            ) : (
              <div
                style={{
                  color: COLORS.green,
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  marginBottom: "1rem",
                }}
              >
                Has acertado {score} preguntas. ¡Sigue intentándolo!
              </div>
            )}

            {/* resto de botones de Ver ranking / Volver al inicio */}


            <p style={{ marginBottom: 16, color: COLORS.green }}>
              Puntuación de {confirmedName || "jugador"}: {score} puntos.
            </p>

            <div
              style={{
                marginTop: 8,
                display: "flex",
                gap: 8,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={async () => {
                  await guardarPartida();
                  setScreen("ranking");
                }}

                style={{
                  backgroundColor: COLORS.green,
                  borderRadius: 12,
                  padding: "0.6rem 1.4rem",
                  border: `2px solid ${COLORS.gold}`,
                  cursor: "pointer",
                  fontWeight: "bold",
                  color: COLORS.white,
                  fontSize: "0.9rem",
                }}
              >
                Ver ranking
              </button>

              <button
                onClick={() => {
                  setScreen("start");
                  setShowCongrats(false);
                  setQuestions([]);
                  setScore(0);
                  setSelectedOption(null);
                  setTimeLeft(15);
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
            </div>
          </div>
        )}

        {screen === "ranking" && (
          <div style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 24, maxWidth: 480, width: "100%", textAlign: "center" }}>
            <h2
              style={{
                fontFamily: `"Playfair Display", serif`,
                fontSize: "1.6rem",
                marginBottom: 16,
                color: COLORS.green,
              }}
            >
              Ranking – {categories.find(c => c.key === rankingCategory)?.label}
            </h2>

            {/* Botones para cambiar de categoría */}
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginBottom: 12 }}>
              {categories.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => {
                    setRankingCategory(cat.key);
                    cargarRanking(cat.key);
                  }}
                  style={{
                    backgroundColor: cat.key === rankingCategory ? COLORS.gold : COLORS.white,
                    borderRadius: 8,
                    padding: "0.3rem 0.8rem",
                    border: `2px solid ${COLORS.gold}`,
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    color: COLORS.green,
                    fontWeight: "bold",
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {ranking.length === 0 ? (
              <p style={{ color: COLORS.green }}>Aún no hay partidas guardadas.</p>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  paddingLeft: 20,
                  color: COLORS.green,
                  maxHeight: 220,      // ajusta para que veas ~10 nombres
                  overflowY: "auto",
                  marginTop: 4,
                }}
              >
                {ranking.map((p, index) => (
                  <div key={p.id} style={{ marginBottom: 4 }}>
                    {index + 1}. {p.nombre} – {p.puntuacion} pts
                  </div>
                ))}
              </div>
            )}


            <button
              onClick={() => setScreen("start")}
              style={{
                marginTop: 16,
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
