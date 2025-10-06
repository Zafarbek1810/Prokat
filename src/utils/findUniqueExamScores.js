function findUniqueExamScores(examScoreData) {
    let maxLength = 0; // Eng uzun examScores uzunligi
    let longestExamScores = null; // Eng uzun examScores
    const uniqueExamScores = new Set(); // Set to store unique examScores
    const uniqueExamId = new Set(); // Set to store unique examScores
    

    // Arrayni aylanib o'tamiz
    for (let i = 0; i < examScoreData.length; i++) {
      const examScores = examScoreData[i].examScores;
  
      if (examScores.length > maxLength) {
        maxLength = examScores.length;
        longestExamScores = examScores;
      }
  
      // Unique examScoresni setga qo'shamiz
      for (let j = 0; j < examScores.length; j++) {
        uniqueExamScores.add(examScores[j]?.date);
      }

      for (let j = 0; j < examScores.length; j++) {
        uniqueExamId.add(examScores[j]?.id);
      }
    }

    return {
      longestExamScores: longestExamScores,
      uniqueExamScores: Array.from(uniqueExamScores).sort(),
      uniqueExamId: Array.from(uniqueExamId).sort(),
    };
  }

  export default findUniqueExamScores;