import { Button } from "@/components/ui/button";

interface QuizSelectionFormProps {
  existingQuizzes: any[];
  selectedQuizId: string | null;
  onQuizSelect: (id: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

export const QuizSelectionForm = ({
  existingQuizzes,
  selectedQuizId,
  onQuizSelect,
  onSubmit,
  onCancel
}: QuizSelectionFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-4">
        {existingQuizzes?.map((quiz) => (
          <div key={quiz.id} className="flex items-center space-x-2 p-4 border rounded">
            <input
              type="radio"
              name="quiz_id"
              value={quiz.id}
              checked={selectedQuizId === quiz.id}
              onChange={(e) => onQuizSelect(e.target.value)}
              className="h-4 w-4"
            />
            <div>
              <h3 className="font-medium">{quiz.title}</h3>
              <p className="text-sm text-gray-500">{quiz.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!selectedQuizId}>
          Attach Quiz
        </Button>
      </div>
    </form>
  );
};