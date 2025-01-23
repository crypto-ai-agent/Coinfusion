interface QuizFeedbackProps {
  isCorrect: boolean;
  feedbackText: string;
  explanation?: string;
}

export const QuizFeedback = ({
  isCorrect,
  feedbackText,
  explanation,
}: QuizFeedbackProps) => {
  return (
    <div className={`p-4 rounded-lg ${
      isCorrect
        ? 'bg-green-50 text-green-700'
        : 'bg-red-50 text-red-700'
    }`}>
      <p className="font-medium">{feedbackText}</p>
      {explanation && (
        <p className="mt-2 text-sm">{explanation}</p>
      )}
    </div>
  );
};