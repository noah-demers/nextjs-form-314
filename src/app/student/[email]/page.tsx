import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import EditStudentForm from '../../../components/EditStudentForm';
import type { ICreateStudentForm } from '@/lib/validationSchemas';

const EditStudentPage = async ({ params }: { params: { email: string } }) => {
  const email = decodeURIComponent(params.email); // Important to decode URL param

  // Fetch student data from Prisma
  const studentData = await prisma.studentData.findUnique({
    where: { email },
  });

  const enrollmentData = await prisma.enrollmentData.findUnique({
    where: { email },
  });

  if (!studentData || !enrollmentData) {
    throw notFound();
  }

  // Combine both data objects
  const studentRaw = { ...studentData, ...enrollmentData };

  // Normalize nullable fields to fit ICreateStudentForm type
  const student: ICreateStudentForm = {
    ...studentRaw,
    bio: studentRaw.bio ?? '', // Convert null to empty string
  };

  console.log('EditStudentPage: ', email, student);

  return (
    <main>
      <h1 className="text-center">Edit Student</h1>
      <EditStudentForm student={student} />
    </main>
  );
};

export default EditStudentPage;
