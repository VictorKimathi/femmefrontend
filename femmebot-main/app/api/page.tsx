// api.ts

// Base URL for your backend API
const BASE_URL = "http://localhost:5000/api";

// ================================================
// Interfaces
// ================================================

// Cycle-related types (adjust the properties as needed)
export interface CycleData {
  // Define your cycle data properties here. For example:
  // startDate: string;
  // endDate: string;
  // details?: string;
  [key: string]: unknown;
}

export interface Cycle extends CycleData {
  id: string;
}

// Emotion advice response interface based on your backend response format
export interface EmotionAdvice {
  diet: string;
  behavior: string;
  exercise: string;
  coping: string;
  issues: string;
}

// Response for issues and sex education endpoints
export interface IssueResponse {
  message: string | PromiseLike<string>;
  senderId: string;
  answer: string;
}

// Since both issues and sex education return a similar response structure,
// you can use the same type or create a separate one if needed.
export type SexEducationResponse = IssueResponse;

// Payload interfaces for POST requests
export interface CreateIssuePayload {
  question: string;
  senderId: string;
}

export interface EducationQueryPayload {
  question: string;
  senderId: string;
}

export interface EmotionAdvicePayload {
  emotions: string[];
}

// ================================================
// Cycles API Functions
// ================================================

/**
 * Create a new cycle.
 * @param data - The cycle data payload.
 * @returns The created cycle.
 */
export async function createCycle(data: CycleData): Promise<Cycle> {
  const response = await fetch(`${BASE_URL}/cycles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Failed to create cycle: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Get fertility information for a given cycle.
 * @param cycleId - The ID of the cycle.
 * @returns Fertility info (type can be refined once the schema is known).
 */
export async function getFertilityInfo(cycleId: string): Promise<unknown> {
  const response = await fetch(`${BASE_URL}/cycles/fertility/${cycleId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch fertility info: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Get all cycles.
 * @returns An array of cycles.
 */
export async function getAllCycles(): Promise<Cycle[]> {
  const response = await fetch(`${BASE_URL}/cycles`);
  if (!response.ok) {
    throw new Error(`Failed to fetch cycles: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Get a cycle by its ID.
 * @param cycleId - The ID of the cycle.
 * @returns The cycle data.
 */
export async function getCycleById(cycleId: string): Promise<Cycle> {
  const response = await fetch(`${BASE_URL}/cycles/${cycleId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch cycle: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Update a cycle by its ID.
 * @param cycleId - The ID of the cycle.
 * @param data - The updated cycle data.
 * @returns The updated cycle.
 */
export async function updateCycleById(cycleId: string, data: CycleData): Promise<Cycle> {
  const response = await fetch(`${BASE_URL}/cycles/${cycleId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Failed to update cycle: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Delete a cycle by its ID.
 * @param cycleId - The ID of the cycle.
 * @returns A message confirming deletion.
 */
export async function deleteCycleById(cycleId: string): Promise<{ message: string }> {
  const response = await fetch(`${BASE_URL}/cycles/${cycleId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Failed to delete cycle: ${response.statusText}`);
  }
  return response.json();
}

// ================================================
// Emotions API Function
// ================================================

/**
 * Get emotion advice based on an array of emotions.
 * @param data - The payload containing an array of emotions.
 * @returns The advice in a structured format.
 */
export async function getEmotionAdvice(data: EmotionAdvicePayload): Promise<EmotionAdvice> {
  const response = await fetch(`${BASE_URL}/emotions/advice`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Failed to get emotion advice: ${response.statusText}`);
  }
  return response.json();
}

// ================================================
// Issues API Function
// ================================================

/**
 * Create a new issue.
 * @param data - The payload containing the question and senderId.
 * @returns The response including the senderId and the generated answer.
 */
export async function createIssue(data: CreateIssuePayload): Promise<IssueResponse> {
  const response = await fetch(`${BASE_URL}/issues/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Failed to create issue: ${response.statusText}`);
  }
  return response.json();
}

// ================================================
// Sex Education API Function
// ================================================

/**
 * Get an educational response related to sex education.
 * @param data - The payload containing the question and senderId.
 * @returns The response including the senderId and the generated answer.
 */
export async function createEducationResponse(
  data: EducationQueryPayload
): Promise<SexEducationResponse> {
  const response = await fetch(`${BASE_URL}/sex/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Failed to get education response: ${response.statusText}`);
  }
  return response.json();
}
