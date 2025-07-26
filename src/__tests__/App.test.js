 import {
  fireEvent,
  render,
  screen,
  waitFor, 
  waitForElementToBeRemoved,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { server } from "../mocks/server"; 
import App from "../components/App";


beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("displays question prompts after fetching", async () => {
  render(<App />);
  fireEvent.click(screen.queryByText(/View Questions/));
  expect(await screen.findByText(/lorem testum 1/g)).toBeInTheDocument();
  expect(await screen.findByText(/lorem testum 2/g)).toBeInTheDocument();
});

test("creates a new question when the form is submitted", async () => {
  render(<App />);
  await screen.findByText(/lorem testum 1/g);
  fireEvent.click(screen.queryByText("New Question"));

  fireEvent.change(screen.queryByLabelText(/Prompt/), { target: { value: "Test Prompt" } });
  fireEvent.change(screen.queryByLabelText(/Answer 1/), { target: { value: "Test Answer 1" } });
  fireEvent.change(screen.queryByLabelText(/Answer 2/), { target: { value: "Test Answer 2" } });
  fireEvent.change(screen.queryByLabelText(/Answer 3/), { target: { value: "Test Answer 3" } }); // Added this for consistency with 4 answers
  fireEvent.change(screen.queryByLabelText(/Answer 4/), { target: { value: "Test Answer 4" } }); // Added this for consistency with 4 answers
  fireEvent.change(screen.queryByLabelText(/Correct Answer/), { target: { value: "0" } }); // Set correct index to 0 for the new question

  fireEvent.submit(screen.queryByText(/Add Question/));

  fireEvent.click(screen.queryByText(/View Questions/));
  expect(await screen.findByText(/Test Prompt/g)).toBeInTheDocument();
  expect(await screen.findByText(/lorem testum 1/g)).toBeInTheDocument();
});

test("deletes the question when the delete button is clicked", async () => {
  const { rerender } = render(<App />); 
  fireEvent.click(screen.queryByText(/View Questions/));
  await screen.findByText(/lorem testum 1/g);

  fireEvent.click(screen.queryAllByText("Delete Question")[0]);
  await waitForElementToBeRemoved(() => screen.queryByText(/lorem testum 1/g));

  rerender(<App />);  
  await screen.findByText(/lorem testum 2/g); 
  expect(screen.queryByText(/lorem testum 1/g)).not.toBeInTheDocument(); 
});

test("updates the answer when the dropdown is changed", async () => {
  render(<App />); 

  fireEvent.click(screen.queryByText(/View Questions/));
  await screen.findByText(/lorem testum 2/g);  

  const dropdown = screen.queryAllByLabelText(/Correct Answer/)[0];

   
  expect(dropdown.value).toBe("1"); 
  fireEvent.change(dropdown, {
    target: { value: "3" }, 
  });

  
  await waitFor(() => {
    expect(dropdown.value).toBe("3");
  }, { timeout: 3000 }); 

});