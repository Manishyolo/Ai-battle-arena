import { StateGraph,StateSchema,type GraphNode } from "@langchain/langgraph";
import { Mistral_model,Cohere_model,Gemini_model } from "./model.service.js";
import {createAgent , HumanMessage, providerStrategy} from "langchain";

import z from "zod";


const state = new StateSchema({
    problem: z.string().default(""),
    solution_1:z.string().default(""),
    solution_2:z.string().default(""),
    judgement:z.object({
       solution_1_score:z.number().min(0).max(10).default(0),
        solution_2_score:z.number().min(0).max(10).default(0),
        solution_1_reasoning:z.string().default(""),
        solution_2_reasoning:z.string().default(""),
    })
})

const solutionNode:GraphNode<typeof state> = async (state)=>{
        
  const [cohere_response,mistral_response] = await Promise.all([
    Cohere_model.invoke(state.problem),
    Mistral_model.invoke(state.problem)
  ])
     return {
      solution_1: cohere_response.text,
      solution_2: mistral_response.text
     }
}

const judgementNode:GraphNode<typeof state> = async (state)=>{
  const {solution_1,solution_2,problem} = state
  const judge = createAgent({
    model: Gemini_model,
    responseFormat: providerStrategy(z.object({
      solution_1_score:z.number().min(0).max(10),
      solution_2_score:z.number().min(0).max(10),
      solution_1_reasoning:z.string(),
       solution_2_reasoning:z.string(),
    })),
    systemPrompt:"You are a judge tasked with evaluating two solutions genrated by different ai models. Please provide a score between 0 and 10 for each solution, along with your reasoning for the scores.",
    
 })

 const judgeResponse = await judge.invoke({
    messages:[
      new HumanMessage(`
           Problem: ${problem}
            Solution 1: ${solution_1}
            Solution 2: ${solution_2}
            please evaluate the solutions and provide scores and reasoning
        `)
    ]
 })

 const {solution_1_score,solution_2_score,solution_1_reasoning,solution_2_reasoning} = judgeResponse.structuredResponse
 
 return {
  solution_1_score,
  solution_2_score,
  solution_1_reasoning,
  solution_2_reasoning
 }

}