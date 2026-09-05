// DESIGN SYSTEM: Migrated to the current design.md.
"use client"

import { cloneElement, createContext, useContext, useId, useMemo } from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { TriangleAlertIcon } from "lucide-react"

import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

interface FieldContextValue {
  errorId: string
  invalid: boolean
}

const FieldContext = createContext<FieldContextValue | null>(null)

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        "flex flex-col gap-4 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
        className
      )}
      {...props}
    />
  )
}

function FieldLegend({
  className,
  variant = "legend",
  ...props
}: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        "mb-1.5 font-bold data-[variant=label]:text-[0.8125rem] data-[variant=label]:leading-[1.25] data-[variant=legend]:text-base",
        className
      )}
      {...props}
    />
  )
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        "group/field-group @container/field-group flex w-full flex-col gap-5 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4",
        className
      )}
      {...props}
    />
  )
}

const fieldVariants = cva(
  "group/field flex w-full gap-2 data-[invalid=true]:text-destructive",
  {
    variants: {
      orientation: {
        vertical: "flex-col *:w-full [&>.sr-only]:w-auto",
        horizontal:
          "flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
        responsive:
          "flex-col *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-label]:flex-auto [&>.sr-only]:w-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  }
)

function Field({
  className,
  orientation = "vertical",
  invalid = false,
  errorId: errorIdProp,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof fieldVariants> & {
    errorId?: string
    invalid?: boolean
  }) {
  const generatedErrorId = useId()
  const errorId = errorIdProp ?? (props.id ? `${props.id}-error` : generatedErrorId)
  const context = useMemo(
    () => ({ errorId, invalid }),
    [errorId, invalid]
  )

  return (
    <FieldContext.Provider value={context}>
      <div
        role="group"
        data-slot="field"
        data-orientation={orientation}
        data-invalid={invalid || undefined}
        className={cn(fieldVariants({ orientation }), className)}
        {...props}
      />
    </FieldContext.Provider>
  )
}

type FieldControlRenderProps = Pick<
  React.AriaAttributes,
  "aria-describedby" | "aria-invalid"
>

type FieldControlProps = Omit<
  useRender.ComponentProps<"div">,
  "aria-invalid" | "render"
> & {
  render: React.ReactElement<FieldControlRenderProps>
}

function FieldControl({
  "aria-describedby": describedBy,
  render,
  ...props
}: FieldControlProps) {
  const field = useContext(FieldContext)
  const renderedDescription = render.props["aria-describedby"]
  const descriptionIds = Array.from(
    new Set(
      [renderedDescription, describedBy, field?.invalid ? field.errorId : null]
        .flatMap((value) => value?.split(/\s+/) ?? [])
        .filter(Boolean)
    )
  ).join(" ") || undefined
  const invalid = field ? field.invalid || undefined : render.props["aria-invalid"]
  const normalizedRender = cloneElement(render, {
    "aria-describedby": descriptionIds,
    "aria-invalid": invalid,
  })

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        "aria-describedby": descriptionIds,
        "aria-invalid": invalid,
      },
      props
    ),
    render: normalizedRender,
  })
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn(
        "group/field-content flex flex-1 flex-col gap-0.5 leading-snug",
        className
      )}
      {...props}
    />
  )
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        "group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:pointer-events-none group-data-[disabled=true]/field:text-disabled-foreground has-data-checked:border-primary has-data-checked:bg-brand-coral-soft has-[>[data-slot=field]]:rounded-lg has-[>[data-slot=field]]:border has-[>[data-slot=field]]:border-border has-[>[data-slot=field]]:not-has-[:disabled,[data-disabled]]:hover:bg-surface-inset has-[>[data-slot=field]]:has-[:focus-visible]:border-ring has-[>[data-slot=field]]:has-[:focus-visible]:ring-[3px] has-[>[data-slot=field]]:has-[:focus-visible]:ring-ring has-[>[data-slot=field]]:has-[:focus-visible]:ring-offset-2 has-[>[data-slot=field]]:has-[:focus-visible]:ring-offset-background *:data-[slot=field]:p-2.5",
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col",
        className
      )}
      {...props}
    />
  )
}

function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-label"
      className={cn(
        "flex w-fit items-center gap-2 text-sm font-bold group-data-[disabled=true]/field:text-disabled-foreground",
        className
      )}
      {...props}
    />
  )
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        "text-left text-sm leading-normal font-normal text-muted-foreground group-has-data-horizontal/field:text-balance [[data-variant=legend]+&]:-mt-1.5",
        "last:mt-0 nth-last-2:-mt-1",
        "[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        className
      )}
      {...props}
    />
  )
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  children?: React.ReactNode
}) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn(
        "relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2",
        className
      )}
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children && (
        <span
          className="relative mx-auto block w-fit bg-background px-2 text-muted-foreground"
          data-slot="field-separator-content"
        >
          {children}
        </span>
      )}
    </div>
  )
}

function FieldError({
  className,
  children,
  errors,
  ...props
}: Omit<React.ComponentProps<"div">, "id"> & {
  errors?: Array<{ message?: string } | undefined>
}) {
  const field = useContext(FieldContext)
  const content = useMemo(() => {
    if (children) {
      return children
    }

    if (!errors?.length) {
      return null
    }

    const uniqueErrors = [
      ...new Map(errors.map((error) => [error?.message, error])).values(),
    ]

    if (uniqueErrors?.length == 1) {
      return uniqueErrors[0]?.message
    }

    return (
      <ul className="ml-4 flex list-disc flex-col gap-1">
        {uniqueErrors.map(
          (error, index) =>
            error?.message && <li key={index}>{error.message}</li>
        )}
      </ul>
    )
  }, [children, errors])

  if (!content) {
    return null
  }

  return (
    <div
      className={cn(
        "flex items-start gap-2 text-sm font-normal text-destructive [&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0",
        className
      )}
      {...props}
      id={field?.errorId}
      role="alert"
      data-slot="field-error"
    >
      <TriangleAlertIcon aria-hidden="true" />
      <div>{content}</div>
    </div>
  )
}

export {
  Field,
  FieldControl,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
}
