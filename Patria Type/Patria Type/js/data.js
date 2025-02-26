const gameModes = [
  {
    id: 'trivia',
    title: 'Trivia',
    description: 'Pon a prueba tu conocimiento sobre los patriotas dominicanos',
    image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&h=600&fit=crop'
  },
  {
    id: 'characters',
    title: 'Personajes',
    description: 'Aprende sobre los héroes de nuestra patria',
    image: './img/sanchez_francisco.jpg'
  },
  {
    id: 'hymns',
    title: 'Himnos',
    description: 'Practica los himnos más importantes de la República Dominicana',
    image: './img/himno.jpg'
  }
];

const patriots = [
  {
    id: 1,
    name: "Juan Pablo Duarte",
    image: "./img/duarte.jpg",
    quotes: [
      "¡La República Dominicana será libre e independiente o se hunde la isla!",
      "En la unión está la fuerza y en la desunión la muerte.",
      "Ser justos, lo primero, si queremos ser felices.",
      "La nación dominicana será libre e independiente o moriremos todos por ella.",
      "Es tiempo ya de que salgamos del estado de postración en que yacemos.",
      "Nuestra patria debe ser libre sin condición o la isla se hunde en el mar.",
      "Mientras no tengamos patria libre, cada dominicano debe considerarse en un estado permanente de guerra.",
      "Que los dominicanos aprendan a ser libres a través de la educación."
    ]
  },
  {
    id: 2,
    name: "Francisco del Rosario Sánchez",
    image: "./img/sanchez_francisco.jpg",
    quotes: [
      "La patria espera de sus hijos el sacrificio supremo.",
      "¡Dios, Patria y Libertad!",
      "La independencia no se pide, se toma.",
      "Mi sangre es el precio de la libertad dominicana.",
      "Morir por la patria no es sacrificio, es honor.",
      "La patria será independiente o pereceré por ella.",
      "Prefiero la muerte antes que la esclavitud de mi país.",
      "El amor a la patria es el único que puede salvarnos."
    ]
  },
  {
    id: 3,
    name: "Matías Ramón Mella",
    image: "./img/Ramon_Matias_Mella.jpg",
    quotes: [
      "El trabuco de Mella fue la voz de la libertad.",
      "La patria o la muerte.",
      "Por la independencia hasta el último aliento.",
      "Mi vida es de la patria, disponga de ella.",
      "La libertad se conquista con valor y decisión.",
      "El disparo que atronó en la Puerta de la Misericordia fue la señal de nuestra independencia.",
      "Si es preciso morir por la patria, que así sea.",
      "La libertad exige sacrificios que estamos dispuestos a cumplir."
    ]
  }
];

const hymns = [
  {
    id: 1,
    title: "Himno Nacional",
    lyrics: "Quisqueyanos valientes, alcemos<br>Nuestro canto con viva emoción,<br>Y del mundo a la faz ostentemos<br>Nuestro invicto glorioso pendón.<br><br>Salve el pueblo que, intrépido y fuerte,<br>A la guerra a morir se lanzó,<br>Cuando en bélico reto de muerte<br>Sus cadenas de esclavo rompió."
  },
  {
    id: 2,
    title: "Himno a Duarte",
    lyrics: "Gloria a ti, padre de la patria amada,<br>Fundador de la dominicana grey;<br>Tu memoria vivirá siempre sagrada,<br>Como emblema de amor, virtud y ley.<br><br>Fue tu espíritu noble y generoso,<br>Y tu mente, la luz de la verdad;<br>Y por darnos un suelo venturoso,<br>Tu existencia inmolaste sin dudar."
  },
  {
    id: 3,
    title: "Himno a la Bandera",
    lyrics: "Bandera dominicana,<br>Simiente de libertad,<br>Símbolo de la nación,<br>Te rendimos homenaje con lealtad.<br><br>Tus colores rojo y azul,<br>Tu cruz blanca en el centro,<br>Nos recuerdan el sacrificio<br>De los que lucharon por nuestra independencia."
  },
  {
    id: 4,
    title: "Himno de la Restauración",
    lyrics: "Dominicanos, ya la patria os convoca,<br>Acudid prestos a la voz del deber;<br>Que otra vez gimen, con angustia no poca,<br>Los sacros manes de los héroes de ayer.<br><br>Restaurado hemos ya su honor mancillado,<br>Libre es la patria por segunda ocasión;<br>Y los que osaron profanar lo sagrado,<br>Sepan que ahora más altiva es la nación."
  }
];

const triviaQuestions = [
  {
    quote: "¡La República Dominicana será libre e independiente o se hunde la isla!",
    options: [
      "Juan Pablo Duarte",
      "Francisco del Rosario Sánchez",
      "Matías Ramón Mella",
      "Gregorio Luperón"
    ],
    correct: 0
  },
  {
    quote: "La patria espera de sus hijos el sacrificio supremo.",
    options: [
      "Juan Pablo Duarte",
      "Francisco del Rosario Sánchez",
      "Matías Ramón Mella",
      "Gregorio Luperón"
    ],
    correct: 1
  }
];