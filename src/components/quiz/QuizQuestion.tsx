import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface QuizQuestionProps {
  question: string;
  options: string[];
  selectedAnswer: string;
  onAnswerSelect: (answer: string) => void;
}

export const QuizQuestion = ({
  question,
  options,
  selectedAnswer,
  onAnswerSelect,
}: QuizQuestionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{question}</h3>
      
      <RadioGroup
        value={selectedAnswer}
        onValueChange={onAnswerSelect}
      >
        {options.map((option, index) => (
          <div key={index} className="flex items-center space-x-2">
            <RadioGroupItem value={option} id={`option-${index}`} />
            <Label htmlFor={`option-${index}`}>{option}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};