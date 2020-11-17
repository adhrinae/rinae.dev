---
title: "[Summary] Handling React Form states in complex back-office application"
slug: managing-complex-form-state-summary-en
description: "A summary from the talk 'Handling React Form State in complex back-office application' in FEConf KR 2020"
date: 2020-11-17
tags:
  - React
---

## Before get started

- This post is translated version of [my previous post](https://rinae.dev/posts/managing-complex-form-state-summary). I translated the post for my good friend [Bill Luo](https://twitter.com/bluebill1049). Kudos to [his amazing work](https://react-hook-form.com).
- Feel free to any feedback about the content. I'll try to deliver that to the speaker or any other communities.

## TOC

![Slide 1](./images/2020-11-07_01.png)

- I consider that the combination of React Context API and `useImperativeHandle` is the last refuge in implementing form state with Pure React state.

## Why I tried to use React Context for handling form state

![Slide 2](./images/2020-11-07_02.png)

- I've been thinking about how to implement requirements for the back-office application. The first pick was using Context API as a set of states for handling form.
- As a reason for that, firstly, I wanted to avoid Prop Drilling. Because there are several layers of components sharing form states and some input fields(components) are even dependent on other input fields' state.
- Secondly, Even though many fields are for one form, I expect to gather all of the fields when I submit the form.
- However, I could use other form management libraries since the Context API is officially supported, and it seems to be enough for my application at that time. (It was not.)

## The problem when you use Context as your global store

![Slide 3](./images/2020-11-07_03.png)

- As you know, In the code example, any children inside `FormContext.Provider` can access `formState` and `dispatch` using `useContext(FormContext)`.

---

![Slide 4](./images/2020-11-07_04.png)

- This example is quite simple, but you can imagine that this pattern might be useful for a far nested component tree.
- Usually, accessing Context like `useContext(FormContext)` will be replaced by your custom hooks.
So far, this snippet isn't that bad. What if hundreds of components need to access the Context? What if a specific component has a huge computation logic for each rendering? This can bring a performance issue for your application. Because every time values of Context change, every component accessing Context through `useContext(FormContext)` will invoke re-render.
- This means even though you want to update the EmailInput component only, the PasswordInput component will re-render.
- For performance optimization, React developers can leverage memoization for the first step. However, If they use Context API for components, memoization doesn't work.
- You can use memoization to make your components to dump components(taking props only) not using Context API. But I wanted to avoid the props drilling as far as I can.
- I realized that If I don't understand the technology that I use properly, It brings a huge responsibility to maintain later.
- For summary,
    - As `formState` is bigger, and as you use `useContext` often, It will increase unnecessary re-renders.
    - And as increasing unnecessary re-renders, the chance that users feel uncomfortable will rise.

## Using React Context more efficiently

![Slide 5](./images/2020-11-07_05.png)

- Despite that, I thought I could manage form states using the Context API with caution.
- So I extracted states that need to be updated frequently and debounced for updating Context state.
- For inputs that can be updated frequently or expose their ref, I could control them as Uncontrolled input components to minimize the Context state. It can make a better performance.
- And I divided the Context into state and dispatch Contexts, then let consumers choose which Context value they need. `state`, `dispatch`, or both.

---

### Isolate state & debounce

![Slide 6](./images/2020-11-07_06.png)

- I refactored the `EmailInput` component a little bit. The value of input moved to the local state and managed by `useState`. And updating value is debounced by the `useDebounce` hook.
- Here's a point. You need to know that there are two values to care about. The one is visible for users, the other is the internal and delayed value for the input.
- So before submitting the form, you should check two states are synchronized. The sample code has 500ms of delay between two values.

---

### Controlled & Uncontrolled Component

![Slide 7](./images/2020-11-07_07.png)

- When you use Uncontrolled components, you can use ref to extract values from the DOM element directly. The users feel free to input any values, and you need to care about the value before submitting the form.
- It can optimize the performance because it doesn't invoke a re-render even if users change the input's value.
- However, If you need to implement dynamic input fields like having dependencies to other fields, It's tricky to handle them.

---

### Dividing formState Context & dispatch Context

![Slide 8](./images/2020-11-07_08.png)

- Some components only need the `dispatch` function. Other components only need `formState`. By dividing Context, components only need dispatch can avoid unnecessary re-renders.
- But still, I couldn't resolve the root problem that there are re-renders on every `formState` updates.
- Therefore when you use Context API to manage your form states, not all components(children) need Context values. Pass values as props to some components and use `React.memo` for memoization and performance optimization.

It wouldn't be a problem to develop the application's form with an adequate performance with all the above methods. But for too complicated form, still, there will be a performance issue. Should I give up using Context API then? Or should I use other form management libraries?

## React Context + useImperativeHandle hook

![Slide 9](./images/2020-11-07_09.png)

- I looked to make each component manage their field states and gather them all only when I want. Then I found there is the `useImperativeHandle` hook from React APIs.
- Basically, React guides developers to pass state/props in a unidirectional way. However, I thought I could take advantage of this hook to take a detour for managing state bidirectionally. But it would help if you care about using this hook because this hook might increase the complexity of your application and make debugging harder.

---

![Slide 10](./images/2020-11-07_10.png)

- At first, Let's see what the `useImperativeHandle` hook is. It can customize the ref passed from a parent component.
- With this characteristic, a child component can get the parent component's state or `setState` functions to manage the parent component's state directly.

---

![Slide 11](./images/2020-11-07_11.png)

- I made a `FormService` class having a store that can gather components' states.
- When I call the createOrGetItemRef method, it finds stored ref by name and returns it. (or creates a new one if it cannot find a corresponding ref with the name.)
- Now child components can create their ref from `FormService` and customize their values & state managing methods through the `useImperativeHandle` hook. And onSubmit can access all of the refs when it is called.

---

![Slide 12](./images/2020-11-07_12.png)

- Then I created a Form component. It's a simple Provider component passing FormService instance to it's children.

---

![Slide 13](./images/2020-11-07_13.png)

- `FormItem` constructs it's own state. And it uses the `useImperativeHandle` hook to customize the ref made by `FormService`. To simplify the example, it only passes value, setValue, and the real ref of a component's DOM element.
- You may need to pass the error state to validate values or other use cases for the general use case.

---

![Slide 14](./images/2020-11-07_14.png)

- To make the FormItem component handling various use cases, we can apply the render props pattern.

---

![Slide 15](./images/2020-11-07_15.png)

- Finally, now I can create a form without a performance issue by combining `Form` and `FormItem` components above.
- You can check the detailed implementation [here](https://github.com/seonghyeonkimm/react-form).

## React Form Libraries

![Slide 16](./images/2020-11-07_16.png)

- It is still not easy to manage complex business logic like validation, handling special fields that depend on other fields.
- Therefore I recommend you to try to apply open source libraries to your project first and then implement your form management library If you're not comfortable with that.
- From now on, I will speak about my experience and what I felt after I tried famous form management libraries.

---

![Slide 17](./images/2020-11-07_17.png)

- If you query 'React Form Library' on Google, you will see 'React Hook Form' on top. It was 'Formik' before.

---

### Formik

![Slide 18](./images/2020-11-07_18.png)

- Let's talk about 'Formik' first. It's similar to managing state by Context API.
- And It aims to manage the form state with Controlled Components.
- Formik's API is simple so that you can learn and utilize it fast.
- If you have to manage complex form fields, you may need to use `useFormikContext` hook. In this case, you will suffer from the same issues when you implement form states with pure Context API.
- I found many issues complaining about performance on Formik's Github issue page.
- I think Formik is useful for managing small and simple forms, but it's not suitable for implementing complex forms in back-office applications. The Formik team is trying to improve the performance of Formik, but It's not done yet.

---

![Slide 19](./images/2020-11-07_19.png)
![Slide 20](./images/2020-11-07_20.png)

- Like early examples using Context API, I wrapped children with the `Formik` component as a Provider and created components using the Field component.
- If the `TextBField` needs to change the value following `TextAfield`'s value, you can write a component like this. As the number of inputs growing, it will invoke unnecessary re-renders because they use Context values.

---

### React Hook Form

![Slide 21](./images/2020-11-07_21.png)

- React Hook Form(RHF) is using both Uncontrolled components and Controlled components.
- It registers refs to DOMs directly. So it can utilize inputs' values. But they also support the way of managing Controlled components because many components cannot be treated as an Uncontrolled component.
- For a simple form, It's easy as Formik. In contrast, there are some tricky points when you manage a complex form because RHF is based on Uncontrolled components.
- RHF collects all registered fields' refs in one store and uses them when the form is submitted. So it has good performance. Even they introduce them that they reduced unnecessary re-renders at maximum. Also, I can only watch specific fields to develop some dependent form fields. It brings a good performance as well. It shows the best performance among form management libraries, as I know.

---

![Slide 22](./images/2020-11-07_22.png)

- Here's a comparison between RHF and Formik provided by RHF's documentation. I agree with most of the part. But I think Formik is a bit easier for creating a simple form. And when I implement a complex form, RHF was more challenging than I expected. There were some points I needed to know for handling a complex form.
- In terms of community, Formik's community looks not being managed by maintainers. On the contrary, RHF has a growing community, and maintainers are responding fast. So I feel RHF is better with that.

---

![Slide 23](./images/2020-11-07_23.png)

- All APIs of RHF are called by hooks. You usually start from the `useForm` hook at the top of a form.
- You need to pass the `register` function as ref prop.
- For components that cannot access ref prop, there is the `Controller` component to manage Controlled components.

---

![Slide 24](./images/2020-11-07_24.png)

- You can also manually register inputs not using the Controller component.
- If an input has the unique `name` property, it can be registered by the `register` function, and you can change the value of that input through the `setValue` function.
- FYI, RHF's `setValue` function is different from React's `setState` function. It doesn't update values right away. So you may need to synchronize values after the update.
- There is a `watch` function for observing instant changes in input values.

---

### Caution when you are using RHF

![Slide 25](./images/2020-11-07_25.png)

- You should be careful when you set `defaultValues`. RHF only handles registered values. In the example, even if you want to get id values when you submit the form, you cannot catch those values because they are not registered.

---

![Slide 26](./images/2020-11-07_26.png)

- If you need id values for the form data, you should create inputs to register them. In this case, you also need to hide them applying styles like `display: none;`.

---

![Slide 27](./images/2020-11-07_27.png)

- At last, there is a `useFieldArray` hook for handling an array of fields.
- The example is super simple; however, There are many methods that make handling a field array more straightforward, such as `append`, `remove`.

---

![Slide 28](./images/2020-11-07_28.png)

- There's a `useWatch` hook for observing fields isolated.
- When I was building an array of input fields, I could only get the array's whole data with the useWatch hook, even though I only wanted to check the length of the field array. In this case, WatchForm will invoke a re-render, even a value of specific fields, and cause performance issues. So It should be resolved by extra work.

---

![Slide 29](./images/2020-11-07_29.png)

- So I have to create another hidden field for managing and observing several fields manually. Since this value should not be included when I submit the form, it needs extra work to be handled properly.
- Therefore, You should understand the basic concept of RHF, that you will `register` refs of form elements and manage the form through those refs. And you might need a custom registration process for values you don't have to register but want to manage with your form.

## Summary

![Slide 30](./images/2020-11-07_30.png)

- Choose the way of showing the best performance by the requirement you have to implement.
- For a simple form, using Context API is ok. But avoid it when you have to build a complex form.
- If you want to bring a form management library, Try react-hook-form(RHF).
- When RHF is not enough for the requirement, you can consider using the useImperativeHandle hook.
- Or you can utilize other state management libraries providing their optimization strategies.
