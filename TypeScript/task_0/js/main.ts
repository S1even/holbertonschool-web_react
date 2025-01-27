interface Student {
    firstName: string;
    lastName: string;
    age: number;
    location: string;
  }
  
  const student1: Student = {
    firstName: "John",
    lastName: "Doe",
    age: 20,
    location: "New York",
  };
  
  const student2: Student = {
    firstName: "Jane",
    lastName: "Smith",
    age: 22,
    location: "San Francisco",
  };
  
  const studentsList: Student[] = [student1, student2];
  
  const table = document.createElement("table");
  const tableHeader = table.insertRow();
  const headerCell1 = tableHeader.insertCell();
  const headerCell2 = tableHeader.insertCell();
  headerCell1.textContent = "First Name";
  headerCell2.textContent = "Location";
  
  studentsList.forEach((student) => {
    const row = table.insertRow();
    const cell1 = row.insertCell();
    const cell2 = row.insertCell();
    cell1.textContent = student.firstName;
    cell2.textContent = student.location;
  });
  
  document.body.appendChild(table);
  