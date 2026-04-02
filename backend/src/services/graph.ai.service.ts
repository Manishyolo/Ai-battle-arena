import { HumanMessage } from "@langchain/core/messages";
import {
  StateSchema,
  MessagesValue,
  ReducedValue,
  StateGraph,
  START,
  END,
  Graph,
} from "@langchain/langgraph";
import type { GraphNode } from "@langchain/langgraph";
import { Mistral_model,Gemini_model,Cohere_model } from "./model.service.js";
import {z} from "zod";

// state schema
const State = new StateSchema({
  messages: MessagesValue,
  solution_1 : new ReducedValue(z.string().default(""),{
    reducer:(current,next)=>{
            return next
    }
  }),
  solution_2: new ReducedValue(z.string().default(""),{
    reducer:(current,next)=>{
            return next
    }
  }),
  judge_recommendation: new ReducedValue(z.object().default({
     solution_1_score:0,
     solution_2_score:0,
     winner:"solution_1" as "solution_1" | "solution_2"
  }),{
    reducer:(current,next)=>{
            return next
      }})
})
// graph definition
const solutionNode: GraphNode<typeof State> = async (state: typeof State) => {

  const [mistralResponse, geminiResponse, cohereResponse] = await Promise.all([
    Mistral_model.invoke(state.messages[0]),
    Gemini_model.invoke(state.messages[0]),
    Cohere_model.invoke(state.messages[0])
  ])

  console.log(state.messages);
  return {
    messages:state.messages[0]
  }
};
const graph = new StateGraph(State)
.addNode("solution", solutionNode)
.addEdge(START,"solution")
.compile();


export default async function(userMessage:string){
     const result = await graph.invoke({
         messages:[
            new HumanMessage(userMessage)
         ]
     })

     return result.messages
}
