import { Weekday } from "../helpers/weekday";

export class Exercise {
    public id: number;
    public week: number;
    public weekday: Weekday;
    public exerciseName: string;
    public sets: number;
    public repetitions: number;
    public weight: number;
    public time: string;
    public restPeriod: string;
}