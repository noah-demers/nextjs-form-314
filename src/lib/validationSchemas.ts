import * as Yup from 'yup';
import { Hobby, Level, Major, Instructor } from '@prisma/client';

export const levelKeys = Object.keys(Level).filter((key) => Number.isNaN(Number(key)));
export const hobbyKeys = Object.keys(Hobby).filter((key) => Number.isNaN(Number(key)));
export const majorKeys = Object.keys(Major).filter((key) => Number.isNaN(Number(key)));
export const instructorKeys = Object.keys(Instructor).filter((key) => Number.isNaN(Number(key)));

export const gpaValues = ['0.0-0.9', '1.0-1.9', '2.0-2.9', '3.0-3.9', '4.0+'];
export const gpa2String = (num: number) => gpaValues[num];
export const gpa2Number = (str: string) => gpaValues.indexOf(str);

export interface ICreateStudentForm {
  bio?: string;            // no null, only string or undefined
  enrolled?: Date;  // allow null only for enrolled, if you want
  hobbies?: (string | undefined)[];
  name: string;
  email: string;
  level: string;
  gpa: number;
  major: string;
  instructor: string;
}


export const CreateStudentSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  bio: Yup.string().optional(),               // optional, no null
  level: Yup.string().required('Level is required'),
  gpa: Yup.number().required('GPA is required'),
  enrolled: Yup.date().required('Enrollment date is required'),
  hobbies: Yup.array().of(Yup.string()),
  major: Yup.string().oneOf(majorKeys, 'Invalid major').required('Major is required'),
  instructor: Yup.string().oneOf(instructorKeys, 'Invalid instructor').required('Instructor is required'),
});

export const EditStudentSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  bio: Yup.string().optional(),
  level: Yup.string().required('Level is required'),
  gpa: Yup.number().required('GPA is required'),
  enrolled: Yup.date().required('Enrollment date is required'),
  hobbies: Yup.array().of(Yup.string()),
  major: Yup.string().oneOf(majorKeys, 'Invalid major').required('Major is required'),
  instructor: Yup.string().oneOf(instructorKeys, 'Invalid instructor').required('Instructor is required'),
});
