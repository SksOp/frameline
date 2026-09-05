import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card } from "@/components/ui/card"
import { Field, FieldControl, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Item, ItemGroup } from "@/components/ui/item"
import { Separator } from "@/components/ui/separator"

afterEach(cleanup)

describe("component-first UI foundation", () => {
  it("lets cards and items preserve semantic elements and consumer props", () => {
    render(
      <>
        <Card
          render={<article data-testid="card" />}
          aria-labelledby="card-title"
          className="custom-card"
        >
          <h2 id="card-title">A semantic card</h2>
        </Card>
        <Item render={<article data-testid="item" />} aria-label="A fact" />
      </>
    )

    const card = screen.getByTestId("card")
    expect(card.tagName).toBe("ARTICLE")
    expect(card.getAttribute("data-slot")).toBe("card")
    expect(card.getAttribute("data-size")).toBe("default")
    expect(card.getAttribute("aria-labelledby")).toBe("card-title")
    expect(card.className).toContain("custom-card")

    const item = screen.getByTestId("item")
    expect(item.tagName).toBe("ARTICLE")
    expect(item.getAttribute("data-slot")).toBe("item")
    expect(item.getAttribute("data-variant")).toBe("default")
  })

  it("exposes expanded and disabled accordion state accessibly", () => {
    render(
      <Accordion defaultValue={["requirements"]}>
        <AccordionItem value="requirements">
          <AccordionTrigger disabled>Requirements</AccordionTrigger>
          <AccordionContent>Current Android Chrome</AccordionContent>
        </AccordionItem>
      </Accordion>
    )

    const trigger = screen.getByRole("button", { name: "Requirements" })
    expect(trigger.getAttribute("aria-expanded")).toBe("true")
    expect(trigger.getAttribute("aria-disabled")).toBe("true")
    expect(screen.getByText("Current Android Chrome")).not.toBeNull()
  })

  it("uses warning alert tokens and explicit alert semantics", () => {
    render(
      <Alert variant="warning">
        <AlertTitle>Prepared video is stale</AlertTitle>
        <AlertDescription>Prepare it again before recording.</AlertDescription>
      </Alert>
    )

    const alert = screen.getByRole("alert")
    expect(alert.className).toContain("bg-warning-surface")
    expect(alert.className).toContain("text-warning")
  })

  it("connects field labels and errors while retaining input state styling", () => {
    render(
      <Field id="title-field" invalid>
        <FieldLabel htmlFor="title">Title</FieldLabel>
        <FieldControl
          aria-describedby="title-hint"
          render={<Input id="title" disabled />}
        />
        <FieldError>Enter a title.</FieldError>
      </Field>
    )

    const input = screen.getByLabelText("Title")
    expect(input.getAttribute("aria-describedby")).toBe(
      "title-hint title-field-error"
    )
    expect(input.getAttribute("aria-invalid")).toBe("true")
    expect(input.getAttribute("data-slot")).toBe("input")
    expect(input.getAttribute("disabled")).not.toBeNull()
    expect(input.className).toContain("focus-visible:ring-[3px]")
    expect(input.className).toContain("disabled:bg-disabled")
    const error = screen.getByRole("alert")
    expect(error.id).toBe("title-field-error")
    expect(error.textContent).toBe("Enter a title.")
    expect(error.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true")
  })

  it("normalizes conflicting render-element ARIA and honors a Field error ID", () => {
    render(
      <Field invalid errorId="custom-error">
        <FieldControl
          aria-describedby="control-hint shared-hint"
          render={
            <Input
              aria-describedby="render-hint shared-hint"
              aria-invalid="false"
              aria-label="Conflicted control"
            />
          }
        />
        <FieldError>Resolve the conflict.</FieldError>
      </Field>
    )

    const input = screen.getByLabelText("Conflicted control")
    expect(input.getAttribute("aria-invalid")).toBe("true")
    expect(input.getAttribute("aria-describedby")).toBe(
      "render-hint shared-hint control-hint custom-error"
    )
    expect(screen.getByRole("alert").id).toBe("custom-error")
  })

  it("generates matching unique error IDs for fields without explicit IDs", () => {
    render(
      <>
        <Field invalid>
          <FieldControl render={<Input aria-label="First field" />} />
          <FieldError>First error</FieldError>
        </Field>
        <Field invalid>
          <FieldControl render={<Input aria-label="Second field" />} />
          <FieldError>Second error</FieldError>
        </Field>
      </>
    )

    const firstDescription = screen
      .getByLabelText("First field")
      .getAttribute("aria-describedby")
    const secondDescription = screen
      .getByLabelText("Second field")
      .getAttribute("aria-describedby")
    const errors = screen.getAllByRole("alert")

    expect(firstDescription).toBe(errors[0].id)
    expect(secondDescription).toBe(errors[1].id)
    expect(firstDescription).not.toBe(secondDescription)
  })

  it("uses the quiet divider role for separators", () => {
    render(<Separator />)
    const separator = screen.getByRole("separator")
    expect(separator.className).toContain("bg-divider")
  })

  it("lets item primitives preserve native list semantics", () => {
    render(
      <ItemGroup render={<ul aria-label="Facts" />}>
        <Item render={<li />}>One fact</Item>
        <Item render={<li />}>Another fact</Item>
      </ItemGroup>
    )

    const list = screen.getByRole("list", { name: "Facts" })
    expect(list.tagName).toBe("UL")
    expect(screen.getAllByRole("listitem").map((item) => item.tagName)).toEqual([
      "LI",
      "LI",
    ])
  })
})
