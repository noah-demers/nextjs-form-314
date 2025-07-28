'use client';

import {
  ICreateStudentForm,
  EditStudentSchema,
  hobbyKeys,
  levelKeys,
  majorKeys,
  instructorKeys,
  gpaValues,
} from '@/lib/validationSchemas';
import { Button, ButtonGroup, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Multiselect from 'multiselect-react-dropdown';
import { upsertStudent } from '@/lib/dbActions';
import swal from 'sweetalert';

// Option 2 workaround: cast resolver as any to avoid TS error on enrolled Date type
const resolver = yupResolver(EditStudentSchema) as any;

const EditStudentForm = ({ student }: { student: ICreateStudentForm }) => {
  console.log('EditStudentForm: ', student.email, student); // Show client-side email.
  const formPadding = 'py-1';

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    watch,
  } = useForm<ICreateStudentForm>({
    resolver,
    defaultValues: student,
  });

  let watchMajor = watch('major');
  if (!watchMajor) {
    watchMajor = student.major;
  }

  let watchInstructor = watch('instructor');
  if (!watchInstructor) {
    watchInstructor = student.instructor;
  }

  const enrolledDateString = student.enrolled?.toISOString().split('T')[0];

  const onSubmit = async (data: ICreateStudentForm) => {
    const result = await upsertStudent(data);
    if (result) {
      swal('Success!', 'Student data saved successfully!', 'success');
    } else {
      swal('Error!', 'Failed to save student data!', 'error');
      reset();
    }
  };

  return (
    <Container>
      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" value={student.email} {...register('email')} />
            <Row className={formPadding}>
              <Col>
                <Form.Group controlId="formName">
                  <Form.Label>
                    Name
                    <Form.Text style={{ color: 'red' }}>*</Form.Text>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={student.name}
                    {...register('name')}
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.name?.message}</div>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formEmail">
                  <Form.Label>
                    Email
                    <Form.Text style={{ color: 'red' }}>*</Form.Text>
                  </Form.Label>
                  <Form.Control type="email" value={student.email} disabled />
                </Form.Group>
              </Col>
            </Row>
            <Row className={formPadding}>
              <Form.Group controlId="formBio">
                <Form.Label>Biographical Statement</Form.Label>
                <Form.Control as="textarea" defaultValue={student.bio ?? ''} {...register('bio')} />
                <Form.Text muted>(optional)</Form.Text>
              </Form.Group>
            </Row>
            <Row className={formPadding}>
              <Col>
                <Form.Group controlId="formLevel">
                  <Form.Label>
                    Level
                    <Form.Text style={{ color: 'red' }}>*</Form.Text>
                  </Form.Label>
                  <Form.Select
                    defaultValue={student.level}
                    {...register('level')}
                    className={`form-control ${errors.level ? 'is-invalid' : ''}`}
                  >
                    {levelKeys.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </Form.Select>
                  <div className="invalid-feedback">{errors.level?.message}</div>
                  <Form.Text muted>What is your level?</Form.Text>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formGPA">
                  <Form.Label>
                    GPA
                    <Form.Text style={{ color: 'red' }}>*</Form.Text>
                  </Form.Label>
                  <Form.Select
                    {...register('gpa')}
                    defaultValue={student.gpa}
                    className={`form-control ${errors.gpa ? 'is-invalid' : ''}`}
                  >
                    {gpaValues.map((gpa, index) => (
                      <option key={gpa} value={index}>
                        {gpa}
                      </option>
                    ))}
                  </Form.Select>
                  <div className="invalid-feedback">{errors.gpa?.message}</div>
                  <Form.Text>Select one</Form.Text>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formEnrolled">
                  <Form.Label>
                    Date Enrolled
                    <Form.Text style={{ color: 'red' }}>*</Form.Text>
                  </Form.Label>
                  <Form.Control
                    type="date"
                    defaultValue={enrolledDateString}
                    {...register('enrolled')}
                    className={`form-control ${errors.enrolled ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.enrolled?.message}</div>
                </Form.Group>
              </Col>
            </Row>
            <Row className={formPadding}>
              <Form.Group controlId="formHobbies">
                <Form.Label>Hobbies&nbsp;&nbsp;</Form.Label>
                <Controller
                  control={control}
                  name="hobbies"
                  render={({ field: { onChange, value } }) => (
                    <Multiselect
                      options={hobbyKeys}
                      isObject={false}
                      showCheckbox
                      hidePlaceholder
                      closeOnSelect={false}
                      onSelect={onChange}
                      onRemove={onChange}
                      selectedValues={value ?? student.hobbies}
                    />
                  )}
                />
                <Form.Text className="text-muted"> Select hobbies</Form.Text>
              </Form.Group>
            </Row>
            <Row className={formPadding}>
              <Form.Group controlId="formMajor">
                <Form.Label>
                  Major
                  <Form.Text style={{ color: 'red' }}>*</Form.Text>
                  &nbsp;
                </Form.Label>
                <ButtonGroup className={`form-control ${errors.major ? 'is-invalid' : ''}`}>
                  {majorKeys.map((major) => (
                    <Form.Check
                      key={major}
                      inline
                      type="radio"
                      label={major}
                      id={major}
                      value={major}
                      {...register('major')}
                      checked={watchMajor === major}
                    />
                  ))}
                </ButtonGroup>
                <div className="invalid-feedback">{errors.major?.message}</div>
                <Form.Text>What is your major?</Form.Text>
              </Form.Group>
            </Row>

            <Row className={formPadding}>
              <Form.Group controlId="formInstructor">
                <Form.Label>
                  Instructor
                  <Form.Text style={{ color: 'red' }}>*</Form.Text>
                  &nbsp;
                </Form.Label>
                <ButtonGroup className={`form-control ${errors.instructor ? 'is-invalid' : ''}`}>
                  {instructorKeys.map((instructor) => (
                    <Form.Check
                      key={instructor}
                      inline
                      type="radio"
                      label={instructor}
                      id={instructor}
                      value={instructor}
                      {...register('instructor')}
                      checked={watchInstructor === instructor}
                    />
                  ))}
                </ButtonGroup>
                <div className="invalid-feedback">{errors.instructor?.message}</div>
                <Form.Text>Choose your instructor</Form.Text>
              </Form.Group>
            </Row>

            <Button variant="primary" type="submit">
              Update
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EditStudentForm;
