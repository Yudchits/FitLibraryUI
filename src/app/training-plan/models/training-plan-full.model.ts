import { Exercise } from "./exercise.model";

export class TrainingPlanFull {
    public id: number;
    public name: string;
    public description: string;
    public image: string;
    public sport: string;
    public price: number;
    public rating: number;
    public creatorId: number;
    public exercises: Exercise[];
}